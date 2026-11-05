import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/session"

export async function requireAdmin(): Promise<{
  authenticated: boolean
  response?: NextResponse
}> {
  const token = (await cookies()).get("admin_session")?.value

  try {
    if (await verifyAdminSession(token)) return { authenticated: true }
  } catch {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Admin authentication is not configured" },
        { status: 503 },
      ),
    }
  }

  return {
    authenticated: false,
    response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  }
}
