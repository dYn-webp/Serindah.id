import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. SEMAKAN KESELAMATAN SESI
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "OWNER")) {
      return NextResponse.json({ error: "Tidak dibenarkan. Akses ditolak." }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, costPrice, sellingPrice, stock } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        category,
        costPrice: Number(costPrice),
        price: Number(sellingPrice),
        stock: Number(stock),
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=300&h=300&fit=crop" 
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Gagal menyimpan produk" }, { status: 500 });
  }
}