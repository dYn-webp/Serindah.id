// src/app/api/orders/[id]/pay/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    // Perbaikan untuk Next.js 15: params harus di-await
    const resolvedParams = await params;
    
    // Pastikan payload tidak error karena kebesaran
    const body = await req.json();
    const paymentProof = body.paymentProof;

    if (!paymentProof) {
      return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: {
        paymentProof: paymentProof,
        status: "VERIFYING", // Ubah status jadi Menunggu Verifikasi
      }
    });

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error: any) {
    console.error("Upload Error:", error);
    // Jika ukuran gambar terlalu besar
    if (error?.message?.includes("body size") || error?.type === "entity.too.large") {
       return NextResponse.json({ error: "Ukuran gambar terlalu besar. Maksimal 2MB." }, { status: 413 });
    }
    return NextResponse.json({ error: "Gagal mengunggah bukti" }, { status: 500 });
  }
}