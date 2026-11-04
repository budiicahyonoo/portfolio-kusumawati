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
    const {
      title,
      description,
      category,
      date_start,
      date_end,
      sort_order,
      achievements,
      demo_url,
      view_url,
      work_photos,
    } = body;

    // Terima nama field dari admin (technologies / thumbnail_url)
    // maupun versi lama (tags / image_url)
    const techSource = body.technologies ?? body.tags;
    const thumbnail = body.thumbnail_url ?? body.image_url;

    const technologiesArray = toStringArray(techSource, ",");
    const achievementsArray = toStringArray(achievements, "\n");
    const workPhotosArray = toStringArray(work_photos, ",");

    const updatedExperience = await prisma.experience.update({
      where: { id },
      data: {
        title,
        description,
        category,
        technologies: technologiesArray,
        thumbnail_url: thumbnail || null,
        date_start: date_start ? new Date(date_start) : null,
        date_end: date_end ? new Date(date_end) : null,
        sort_order: Number(sort_order) || 0,
        achievements: achievementsArray,
        demo_url: demo_url || null,
        view_url: view_url || null,
        work_photos: workPhotosArray,
      },
    });

    return NextResponse.json(updatedExperience);
  } catch (error: any) {
    console.error("Error PUT Experience:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Gagal memperbarui, data tidak ditemukan atau sudah dihapus" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Gagal memperbarui experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.experience.delete({
      where: { id },
    });
    return NextResponse.json({
      success: true,
      message: "Experience berhasil dihapus",
    });
  } catch (error) {
    console.error("Error DELETE Experience:", error);
    return NextResponse.json(
      { error: "Gagal menghapus experience" },
      { status: 500 }
    );
  }
}