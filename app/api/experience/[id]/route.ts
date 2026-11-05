import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

type RouteParams = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: RouteParams) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  const { id } = await params
  try {
    const body = await request.json()
    const data: Record<string, unknown> = {}
    const stringFields = [
      "organization", "category", "position_en", "position_id", "period_start",
      "period_end", "location", "summary_en", "summary_id", "responsibilities_en",
      "responsibilities_id", "logo_url",
    ]
    for (const field of stringFields) {
      if (typeof body[field] === "string" || body[field] === null) data[field] = body[field]
    }
    if (Array.isArray(body.technical_skills) && body.technical_skills.every((value: unknown) => typeof value === "string")) {
      data.technical_skills = body.technical_skills
    }
    if (body.status === "draft" || body.status === "published") data.status = body.status
    if (typeof body.is_featured === "boolean") data.is_featured = body.is_featured
    if (Number.isInteger(body.sort_order)) data.sort_order = body.sort_order

    return NextResponse.json(await prisma.experience.update({ where: { id }, data }))
  } catch (error) {
    console.error("[LEGACY EXPERIENCE PUT]", error)
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!
  const { id } = await params

  try {
    await prisma.experience.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[LEGACY EXPERIENCE DELETE]", error)
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
