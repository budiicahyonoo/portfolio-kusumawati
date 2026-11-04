import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { sort_order: "asc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("GET Contact Error:", error);
    return NextResponse.json({ error: "Failed to fetch contact data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, url, sort_order } = body;

    const newContact = await prisma.contact.create({
      data: {
        platform,
        url,
        sort_order: Number(sort_order) || 0,
      },
    });

    return NextResponse.json(newContact);
  } catch (error) {
    console.error("POST Contact Error:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}