// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = body;

    // Update status pesanan di database
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ message: "Status diperbarui", order: updatedOrder });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui status" }, { status: 500 });
  }
}