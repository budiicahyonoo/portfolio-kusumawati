import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper: terima array atau string (dipisah koma / baris baru)
function toStringArray(value: unknown, separator: string | RegExp): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(separator).map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, category, sort_order, role, metric } = body;

    // Terima nama field versi baru maupun lama
    const techSource = body.technologies ?? body.tags;
    const demo = body.demo_url ?? body.project_url;
    const view = body.view_url ?? body.github_url;
    const thumbnail = body.thumbnail_url ?? body.image_url;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        category,
        technologies: toStringArray(techSource, ","),
        achievements: toStringArray(body.achievements, "\n"),
        work_photos: toStringArray(body.work_photos, ","),
        demo_url: demo || null,
        view_url: view || null,
        thumbnail_url: thumbnail || null,
        sort_order: Number(sort_order) || 0,
        role: role || null,
        metric: metric || null,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error("Error PUT Projects:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Gagal memperbarui, data tidak ditemukan atau sudah dihapus" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Gagal memperbarui proyek" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: "Proyek berhasil dihapus",
    });
  } catch (error) {
    console.error("Error DELETE Projects:", error);
    return NextResponse.json(
      { error: "Gagal menghapus proyek" },
      { status: 500 }
    );
  }
}