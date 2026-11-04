import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// Selalu ambil data terbaru, jangan di-cache
export const dynamic = "force-dynamic";

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function GET() {
  try {
    const homeData = await prisma.home.findFirst();
    return NextResponse.json(homeData || {}, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error GET Home:", error);
    return NextResponse.json({ error: "Gagal mengambil data home" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const name = clean(body.name);
    if (!name) {
      return NextResponse.json({ error: "Nama lengkap wajib diisi" }, { status: 400 });
    }

    const data = {
      name,
      role: clean(body.role), // kosong = hero pakai role default
      value_proposition: clean(body.value_proposition), // kosong = hero pakai tagline default
      photo_url: clean(body.photo_url) || null,
      email: clean(body.email) || null,
    };

    const existing = await prisma.home.findFirst();

    const saved = existing
      ? await prisma.home.update({ where: { id: existing.id }, data })
      : await prisma.home.create({ data });

    // Supaya halaman publik langsung ikut berubah
    revalidatePath("/");

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Error PUT Home:", error);
    return NextResponse.json({ error: "Gagal memperbarui data home" }, { status: 500 });
  }
}