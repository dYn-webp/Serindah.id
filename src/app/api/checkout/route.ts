// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, address, cartItems, cartTotal } = body;

    // 1. Validasi Data
    if (!customerName || !customerPhone || !address || cartItems.length === 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 2. Buat Transaksi di Database
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        totalAmount: cartTotal,
        status: "PENDING", // Status awal
        items: {
          create: cartItems.map((item: any) => ({
            productId: parseInt(item.id),
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Opsional: Di sini nanti kita panggil API Midtrans untuk dapatkan link pembayaran

    return NextResponse.json({ message: "Pesanan berhasil dibuat!", orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Gagal memproses pesanan" }, { status: 500 });
  }
}