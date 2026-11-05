import { del } from "@vercel/blob"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MIME_SIGNATURES: Record<string, (bytes: Uint8Array) => boolean> = {
  "image/jpeg": (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) =>
    bytes.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value),
  "image/gif": (bytes) =>
    new TextDecoder().decode(bytes.slice(0, 6)) === "GIF87a" ||
    new TextDecoder().decode(bytes.slice(0, 6)) === "GIF89a",
  "image/webp": (bytes) =>
    new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
    new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP",
  "application/pdf": (bytes) => new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-",
}

type UploadMetadata = {
  originalFilename: string
  mimeType: string
}

function cleanFilename(filename: string): string {
  return filename
    .replace(/[\\/]/g, "")
    .replace(/[^\p{L}\p{N}._ -]/gu, "")
    .trim()
    .slice(0, 180)
}

function parseUploadMetadata(value: string | null): UploadMetadata | null {
  if (!value) return null
  try {
    const metadata = JSON.parse(value) as Partial<UploadMetadata>
    const originalFilename = typeof metadata.originalFilename === "string"
      ? cleanFilename(metadata.originalFilename)
      : ""
    if (!originalFilename || typeof metadata.mimeType !== "string" || !MIME_SIGNATURES[metadata.mimeType]) {
      return null
    }
    return { originalFilename, mimeType: metadata.mimeType }
  } catch {
    return null
  }
}

function getFileType(mime: string): string {
  return mime.startsWith("image/") ? "image" : "pdf"
}

export async function GET(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const query = searchParams.get("q")?.trim()
    const url = searchParams.get("url")
    if (url) {
      const asset = await prisma.mediaAsset.findUnique({ where: { url } })
      if (!asset) return NextResponse.json({ error: "Uploaded file was not registered" }, { status: 404 })
      return NextResponse.json(asset)
    }
    const assets = await prisma.mediaAsset.findMany({
      where: {
        ...(type ? { file_type: type } : {}),
        ...(query
          ? {
              OR: [
                { filename: { contains: query, mode: "insensitive" } },
                { original_filename: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { created_at: "desc" },
    })
    return NextResponse.json(assets)
  } catch (error) {
    console.error("[MEDIA GET]", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let body: HandleUploadBody
  try {
    body = await request.json() as HandleUploadBody
  } catch (error) {
    console.error("[MEDIA POST BODY]", error)
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || !("type" in body)) {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
  }

  if (body.type !== "blob.generate-client-token" && body.type !== "blob.upload-completed") {
    return NextResponse.json({ error: "Unsupported upload request" }, { status: 400 })
  }

  if (body.type === "blob.generate-client-token") {
    if (!body.payload || typeof body.payload.pathname !== "string") {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
    }
    const { authenticated, response } = await requireAdmin()
    if (!authenticated) return response!
    const metadata = parseUploadMetadata(body.payload.clientPayload)
    if (!metadata) {
      return NextResponse.json({ error: "Only JPEG, PNG, GIF, WebP, and PDF files are allowed" }, { status: 415 })
    }
    if (!body.payload.pathname.startsWith("portfolio/") || body.payload.pathname.includes("..")) {
      return NextResponse.json({ error: "Invalid upload path" }, { status: 400 })
    }
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const metadata = parseUploadMetadata(clientPayload)
        if (!metadata || !pathname.startsWith("portfolio/") || pathname.includes("..")) {
          throw new Error("Invalid upload request")
        }
        return {
          allowedContentTypes: [metadata.mimeType],
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify(metadata),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const metadata = parseUploadMetadata(tokenPayload ?? null)
        if (!metadata || blob.contentType !== metadata.mimeType) {
          throw new Error("Uploaded file type did not match the selected type")
        }

        const signatureMatches = MIME_SIGNATURES[metadata.mimeType]
        const response = await fetch(blob.url)
        if (!response.ok) throw new Error("Could not verify uploaded file content")
        const bytes = new Uint8Array(await response.arrayBuffer())
        if (bytes.length === 0 || bytes.length > MAX_FILE_SIZE || !signatureMatches(bytes)) {
          await del(blob.url)
          throw new Error("File content does not match the declared type or exceeds 5 MB")
        }

        try {
          await prisma.mediaAsset.upsert({
            where: { url: blob.url },
            create: {
              url: blob.url,
              filename: blob.pathname.split("/").pop() || metadata.originalFilename,
              original_filename: metadata.originalFilename,
              file_type: getFileType(metadata.mimeType),
              mime_type: metadata.mimeType,
              file_size: bytes.length,
            },
            update: {
              filename: blob.pathname.split("/").pop() || metadata.originalFilename,
              original_filename: metadata.originalFilename,
              file_type: getFileType(metadata.mimeType),
              mime_type: metadata.mimeType,
              file_size: bytes.length,
            },
          })
        } catch (error) {
          await del(blob.url).catch((cleanupError) => {
            console.error("[MEDIA UPLOAD ROLLBACK]", cleanupError)
          })
          throw error
        }
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("[MEDIA POST]", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
