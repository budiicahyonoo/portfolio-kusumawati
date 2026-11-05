import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import {
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSession,
} from "@/lib/session"
import { verifyAdminSession } from "@/lib/session"

export async function GET() {
  try {
    const token = (await cookies()).get("admin_session")?.value
    return NextResponse.json({ authenticated: await verifyAdminSession(token) })
  } catch (error) {
    console.error("[AUTH GET]", error)
    return NextResponse.json(
      { error: "Authentication is unavailable" },
      { status: 503 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password : ""
    if (!password || password.length > 1024) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const admin = await prisma.admin.findFirst()
    if (!admin) {
      return NextResponse.json({ error: "Admin account is not configured" }, { status: 503 })
    }

    if (!(await bcrypt.compare(password, admin.password_hash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createAdminSession(admin.username)
    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    })
    return response
  } catch (error) {
    console.error("[AUTH POST]", error)
    return NextResponse.json(
      { error: "Authentication is unavailable" },
      { status: 503 },
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
