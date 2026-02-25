// src/app/api/banners/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Mengambil semua data banner
export async function GET() {
  try {
    const banners = await prisma.banner.findMany();
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data banner" }, { status: 500 });
  }
}

// PUT: Menyimpan atau memperbarui banner
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { position, title, subtitle, imageUrl } = body;

    // Upsert: Jika posisi banner (misal: MAIN) sudah ada, maka update. Jika belum, buat baru.
    const banner = await prisma.banner.upsert({
      where: { position },
      update: { title, subtitle, imageUrl },
      create: { position, title, subtitle, imageUrl, isActive: true },
    });

    return NextResponse.json({ message: "Banner berhasil diperbarui", banner });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui banner" }, { status: 500 });
  }
}