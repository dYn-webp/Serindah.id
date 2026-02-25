// src/app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
      include: {
        items: {
          include: { product: true }
        }
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil pesanan" }, { status: 500 });
  }
}