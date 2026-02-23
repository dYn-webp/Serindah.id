// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah digunakan!" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database dengan role USER
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // <-- Penting: Otomatis jadi pembeli, bukan admin
      },
    });

    return NextResponse.json({ message: "Akun berhasil dibuat!", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat akun" }, { status: 500 });
  }
}