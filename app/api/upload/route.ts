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

function getPortfolioBlobPath(value: string): string | null {
  try {
    const url = new URL(value)
    if (
      url.protocol !== "https:" ||
      !/^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i.test(url.hostname) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return null
    }

    const pathname = decodeURIComponent(url.pathname.slice(1))
    if (!pathname.startsWith("portfolio/") || pathname.includes("..")) return null
    return pathname
  } catch {
    return null
  }
}

async function registerUploadedAsset(
  url: string,
  pathname: string,
  contentType: string,
  metadata: UploadMetadata,
  rollbackOnFailure = false,
) {
  if (contentType !== metadata.mimeType) {
    throw new Error("Uploaded file type did not match the selected type")
  }

  const response = await fetch(url, { redirect: "error" })
  if (!response.ok) throw new Error("Could not verify uploaded file content")

  const bytes = new Uint8Array(await response.arrayBuffer())
  const signatureMatches = MIME_SIGNATURES[metadata.mimeType]
  if (
    bytes.length === 0 ||
    bytes.length > MAX_FILE_SIZE ||
    !signatureMatches(bytes) ||
    response.headers.get("content-type")?.split(";")[0] !== metadata.mimeType
  ) {
    if (rollbackOnFailure) await del(url)
    throw new Error("File content does not match the declared type or exceeds 5 MB")
  }

  try {
    return await prisma.mediaAsset.upsert({
      where: { url },
      create: {
        url,
        filename: pathname.split("/").pop() || metadata.originalFilename,
        original_filename: metadata.originalFilename,
        file_type: getFileType(metadata.mimeType),
        mime_type: metadata.mimeType,
        file_size: bytes.length,
      },
      update: {
        filename: pathname.split("/").pop() || metadata.originalFilename,
        original_filename: metadata.originalFilename,
        file_type: getFileType(metadata.mimeType),
        mime_type: metadata.mimeType,
        file_size: bytes.length,
      },
    })
  } catch (error) {
    if (rollbackOnFailure) {
      await del(url).catch((cleanupError) => {
        console.error("[MEDIA UPLOAD ROLLBACK]", cleanupError)
      })
    }
    throw error
  }
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
  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    console.error("[MEDIA POST BODY]", error)
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
  }

  if (!body || typeof body !== "object" || !("type" in body)) {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
  }

  if (body.type === "blob.register-upload") {
    if (!("payload" in body) || !body.payload || typeof body.payload !== "object") {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
    }
    const payload = body.payload
    if (!("url" in payload) || typeof payload.url !== "string" ||
        !("clientPayload" in payload) || typeof payload.clientPayload !== "string") {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
    }

    const { authenticated, response } = await requireAdmin()
    if (!authenticated) return response!

    const metadata = parseUploadMetadata(payload.clientPayload)
    const pathname = getPortfolioBlobPath(payload.url)
    if (!metadata || !pathname) {
      return NextResponse.json({ error: "Invalid uploaded file" }, { status: 400 })
    }

    try {
      const asset = await registerUploadedAsset(
        payload.url,
        pathname,
        metadata.mimeType,
        metadata,
      )
      return NextResponse.json(asset)
    } catch (error) {
      console.error("[MEDIA REGISTER]", error)
      return NextResponse.json({ error: "Could not register uploaded file" }, { status: 500 })
    }
  }

  if (body.type !== "blob.generate-client-token" && body.type !== "blob.upload-completed") {
    return NextResponse.json({ error: "Unsupported upload request" }, { status: 400 })
  }

  const uploadBody = body as HandleUploadBody

  if (uploadBody.type === "blob.generate-client-token") {
    if (!uploadBody.payload || typeof uploadBody.payload.pathname !== "string") {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 })
    }
    const { authenticated, response } = await requireAdmin()
    if (!authenticated) return response!
    const metadata = parseUploadMetadata(uploadBody.payload.clientPayload)
    if (!metadata) {
      return NextResponse.json({ error: "Only JPEG, PNG, GIF, WebP, and PDF files are allowed" }, { status: 415 })
    }
    if (!uploadBody.payload.pathname.startsWith("portfolio/") || uploadBody.payload.pathname.includes("..")) {
      return NextResponse.json({ error: "Invalid upload path" }, { status: 400 })
    }
  }

  try {
    const result = await handleUpload({
      body: uploadBody,
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
        if (!metadata) throw new Error("Invalid upload metadata")
        await registerUploadedAsset(blob.url, blob.pathname, blob.contentType, metadata, true)
      },
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("[MEDIA POST]", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
