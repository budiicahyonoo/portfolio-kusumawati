const SESSION_TTL_SECONDS = 60 * 60 * 24

type SessionPayload = {
  username: string
  issuedAt: number
  expiresAt: number
}

function toBase64Url(value: Uint8Array): string {
  let binary = ""
  for (const byte of value) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function asArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
}

async function signingKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters")
  }

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

export async function createAdminSession(username: string): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    username,
    issuedAt,
    expiresAt: issuedAt + SESSION_TTL_SECONDS,
  }
  const encodedPayload = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(),
    new TextEncoder().encode(encodedPayload),
  )

  return `${encodedPayload}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false

  let encodedPayload = ""
  let signature: Uint8Array = new Uint8Array()
  try {
    const [payloadPart, signaturePart, ...extra] = token.split(".")
    encodedPayload = payloadPart
    const encodedSignature = signaturePart
    if (!encodedPayload || !encodedSignature || extra.length > 0) return false

    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encodedPayload)),
    ) as Partial<SessionPayload>
    const now = Math.floor(Date.now() / 1000)
    if (
      typeof payload.username !== "string" ||
      typeof payload.issuedAt !== "number" ||
      typeof payload.expiresAt !== "number" ||
      payload.issuedAt > now ||
      payload.expiresAt <= now ||
      payload.expiresAt - payload.issuedAt > SESSION_TTL_SECONDS
    ) {
      return false
    }

    signature = fromBase64Url(encodedSignature)
  } catch {
    return false
  }

  const key = await signingKey()
  try {
    return crypto.subtle.verify(
      "HMAC",
      key,
      asArrayBuffer(signature),
      new TextEncoder().encode(encodedPayload),
    )
  } catch {
    return false
  }
}

export const ADMIN_SESSION_TTL_SECONDS = SESSION_TTL_SECONDS
