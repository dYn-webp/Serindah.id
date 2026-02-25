// src/app/api/orders/[id]/status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { status } = await req.json();

    const order = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: { status },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Update Status Error:", error);
    return NextResponse.json({ error: "Gagal mengupdate status" }, { status: 500 });
  }
}