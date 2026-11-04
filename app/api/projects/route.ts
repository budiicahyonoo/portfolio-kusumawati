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
    const projects = await prisma.project.findMany({
      orderBy: { sort_order: "asc" },
    });

    const formattedProjects = projects.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      technologies: p.technologies || [],
      tags: p.technologies ? p.technologies.join(", ") : "",
      achievements: p.achievements || [],
      work_photos: p.work_photos || [],
      demo_url: p.demo_url,
      project_url: p.demo_url,
      view_url: p.view_url,
      github_url: p.view_url,
      thumbnail_url: p.thumbnail_url,
      image_url: p.thumbnail_url,
      sort_order: p.sort_order,
      role: p.role,
      metric: p.metric,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error GET Projects:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data proyek" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, sort_order, role, metric } = body;

    // Terima nama field versi baru maupun lama
    const techSource = body.technologies ?? body.tags;
    const demo = body.demo_url ?? body.project_url;
    const view = body.view_url ?? body.github_url;
    const thumbnail = body.thumbnail_url ?? body.image_url;

    const newProject = await prisma.project.create({
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

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Error POST Projects:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan proyek" },
      { status: 500 }
    );
  }
}