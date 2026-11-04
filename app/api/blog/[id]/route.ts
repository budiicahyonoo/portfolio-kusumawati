import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Pastikan menangkap slug, tags, dan is_published
    const { title, slug, description, category, tags, thumbnail_url, content, read_time, sort_order, is_published } = body;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug, // Wajib disertakan agar slug terupdate
        description,
        category,
        tags: tags || [], // Simpan sebagai array
        thumbnail_url: thumbnail_url || null,
        content: content || null,
        is_published: is_published ?? false, // Update status publish/draft
        read_time: Number(read_time) || 5,
        sort_order: Number(sort_order) || 0,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("PUT Blog Error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("DELETE Blog Error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}