import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { created_at: "desc" }, // Urutkan dari yang terbaru
      include: { comments: true },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET Blog Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data blog" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Tambahkan slug, tags, dan is_published
    const { title, slug, description, category, tags, thumbnail_url, content, read_time, sort_order, is_published } = body;

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug, // Wajib ada untuk URL SEO
        description,
        category,
        tags: tags || [], // Array string
        thumbnail_url: thumbnail_url || null,
        content: content || null,
        is_published: is_published ?? false, // Default false (Draft)
        read_time: Number(read_time) || 5,
        sort_order: Number(sort_order) || 0,
      },
    });

    return NextResponse.json(newBlog);
  } catch (error) {
    console.error("POST Blog Error:", error);
    return NextResponse.json({ error: "Gagal membuat blog baru" }, { status: 500 });
  }
}