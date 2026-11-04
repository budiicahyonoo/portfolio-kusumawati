import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, category, logo_url, sort_order } = body;

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        logo_url,
        sort_order: Number(sort_order) || 0,
      },
    });

    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error("PUT Skill Error:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    console.error("DELETE Skill Error:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}