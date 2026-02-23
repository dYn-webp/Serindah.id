// src/app/api/setup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Cek apakah admin sudah ada di database
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@froze.com" }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Akun admin sudah ada di database!", 
        email: "admin@froze.com",
        keterangan: "Jika Anda lupa passwordnya, silakan hapus file dev.db, jalankan 'npx prisma db push' lagi, dan refresh halaman ini."
      });
    }

    // 2. Enkripsi (hash) kata sandi "admin123"
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 3. Masukkan data Admin ke database
    const newAdmin = await prisma.user.create({
      data: {
        name: "Admin Frozemart",
        email: "admin@froze.com",
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    return NextResponse.json({ 
      status: "SUKSES",
      message: "Akun Admin berhasil dibuat!", 
      email: newAdmin.email,
      password: "admin123" 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat akun admin." }, { status: 500 });
  }
}