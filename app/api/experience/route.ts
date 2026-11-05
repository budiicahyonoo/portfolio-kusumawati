import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const records = await prisma.experience.findMany({ orderBy: { sort_order: "asc" } })
    return NextResponse.json(records)
  } catch (error) {
    console.error("[LEGACY EXPERIENCE GET]", error)
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { authenticated, response } = await requireAdmin()
  if (!authenticated) return response!

  try {
    const body = await request.json()
    const organization = typeof body.organization === "string" ? body.organization.trim() : ""
    const position = typeof body.position_en === "string" ? body.position_en.trim() : ""
    const category = body.category
    const periodStart = typeof body.period_start === "string" ? body.period_start.trim() : ""
    if (!organization || !position || !periodStart || !["Work", "Internship", "Speaker"].includes(category)) {
      return NextResponse.json(
        { error: "organization, position_en, period_start, and a valid category are required" },
        { status: 400 },
      )
    }

    const created = await prisma.experience.create({
      data: {
        organization,
        position_en: position,
        position_id: typeof body.position_id === "string" ? body.position_id : null,
        category,
        period_start: periodStart,
        period_end: typeof body.period_end === "string" ? body.period_end : null,
        summary_en: typeof body.summary_en === "string" ? body.summary_en : null,
        summary_id: typeof body.summary_id === "string" ? body.summary_id : null,
        technical_skills: Array.isArray(body.technical_skills) ? body.technical_skills.filter((value: unknown) => typeof value === "string") : [],
        status: body.status === "published" ? "published" : "draft",
        is_featured: body.is_featured === true,
        sort_order: Number.isInteger(body.sort_order) ? body.sort_order : 0,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("[LEGACY EXPERIENCE POST]", error)
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}
