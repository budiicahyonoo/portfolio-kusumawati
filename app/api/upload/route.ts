import { del, put } from "@vercel/blob"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export const runtime = "nodejs"

const MAX_FILE_SIZE = 10 * 1024 * 1024
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
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  const { searchParams } = new URL(request.url)
  const suppliedName = searchParams.get("filename") || ""
  const mimeType = searchParams.get("mimeType") || request.headers.get("content-type") || ""
  const filename = suppliedName
    .replace(/[\\/]/g, "")
    .replace(/[^\p{L}\p{N}._ -]/gu, "")
    .trim()
    .slice(0, 180)

  if (!filename || !request.body) {
    return NextResponse.json({ error: "Filename and file body are required" }, { status: 400 })
  }

  const signatureMatches = MIME_SIGNATURES[mimeType]
  if (!signatureMatches) {
    return NextResponse.json({ error: "Only JPEG, PNG, GIF, WebP, and PDF files are allowed" }, { status: 415 })
  }

  try {
    const bytes = new Uint8Array(await request.arrayBuffer())
    if (bytes.length === 0 || bytes.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File must be between 1 byte and 10 MB" }, { status: 413 })
    }
    if (!signatureMatches(bytes)) {
      return NextResponse.json({ error: "File content does not match the declared type" }, { status: 415 })
    }

    const blob = await put(filename, Buffer.from(bytes), {
      access: "public",
      addRandomSuffix: true,
      contentType: mimeType,
    })

    try {
      const asset = await prisma.mediaAsset.create({
        data: {
          url: blob.url,
          filename: blob.pathname.split("/").pop() || filename,
          original_filename: filename,
          file_type: getFileType(mimeType),
          mime_type: mimeType,
          file_size: bytes.length,
        },
      })
      return NextResponse.json(asset, { status: 201 })
    } catch (error) {
      await del(blob.url).catch((cleanupError) => {
        console.error("[MEDIA UPLOAD ROLLBACK]", cleanupError)
      })
      throw error
    }
  } catch (error) {
    console.error("[MEDIA POST]", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
