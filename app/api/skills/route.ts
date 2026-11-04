import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET Skills Error:", error);
    return NextResponse.json({ error: "Failed to fetch skills data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, logo_url, sort_order } = body;

    const newSkill = await prisma.skill.create({
      data: {
        name,
        category,
        logo_url,
        sort_order: Number(sort_order) || 0,
      },
    });

    return NextResponse.json(newSkill);
  } catch (error) {
    console.error("POST Skill Error:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}