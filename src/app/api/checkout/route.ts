// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, address, items, totalAmount } = body;

    if (!customerName || !customerPhone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Simpan Pesanan ke Database
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        totalAmount,
        status: "PENDING", // PENDING = Menunggu Pembayaran
        items: {
          create: items.map((item: any) => ({
            productId: parseInt(item.id),
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 2. Kembalikan Order ID ke Frontend untuk diarahkan ke halaman Upload Bukti
    return NextResponse.json({ 
      message: "Pesanan berhasil dibuat!", 
      orderId: order.id
    }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Gagal memproses pesanan" }, { status: 500 });
  }
}