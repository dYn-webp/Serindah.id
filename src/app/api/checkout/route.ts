// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, address, cartItems, cartTotal } = body;

    if (!customerName || !customerPhone || !address || cartItems.length === 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Simpan Pesanan ke Database (Status PENDING)
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        address,
        totalAmount: cartTotal,
        status: "PENDING", 
        items: {
          create: cartItems.map((item: any) => ({
            productId: parseInt(item.id),
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 2. Hubungkan ke Midtrans (Gunakan Sandbox/Mode Uji Coba)
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-dummy", // Ambil dari .env
    });

    // 3. Buat Parameter Pembayaran untuk Midtrans
    let parameter = {
      transaction_details: {
        order_id: order.id, // Gunakan ID Order dari database kita
        gross_amount: cartTotal,
      },
      customer_details: {
        first_name: customerName,
        phone: customerPhone,
        shipping_address: {
          first_name: customerName,
          phone: customerPhone,
          address: address,
        }
      },
    };

    // 4. Minta Link Pembayaran ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    const paymentUrl = transaction.redirect_url;

    // 5. Simpan Link Pembayaran tersebut ke Database kita
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentUrl: paymentUrl },
    });

    // 6. Kembalikan Link Pembayaran ke Frontend (Halaman Keranjang)
    return NextResponse.json({ 
      message: "Pesanan berhasil dibuat!", 
      orderId: order.id,
      paymentUrl: paymentUrl 
    }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Gagal memproses pesanan" }, { status: 500 });
  }
}