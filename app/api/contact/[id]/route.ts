import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { platform, url, sort_order } = body;

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        platform,
        url,
        sort_order: Number(sort_order) || 0,
      },
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("PUT Contact Error:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("DELETE Contact Error:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}