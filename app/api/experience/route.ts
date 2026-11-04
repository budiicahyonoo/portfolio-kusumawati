import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { sort_order: "asc" },
    });

    const formattedExperiences = experiences.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      category: e.category,
      image_url: e.thumbnail_url,
      thumbnail_url: e.thumbnail_url,
      date_start: e.date_start,
      date_end: e.date_end,
      sort_order: e.sort_order,
      demo_url: e.demo_url,
      view_url: e.view_url,
      technologies: e.technologies || [],
      achievements: e.achievements || [],
      work_photos: e.work_photos || [],
      tags: e.technologies ? e.technologies.join(", ") : "",
    }));

    return NextResponse.json(formattedExperiences);
  } catch (error) {
    console.error("Error GET Experience:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data experience" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const newExperience = await prisma.experience.create({
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

    return NextResponse.json(newExperience);
  } catch (error) {
    console.error("Error POST Experience:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan experience" },
      { status: 500 }
    );
  }
}