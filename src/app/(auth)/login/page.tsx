// src/app/(auth)/login/page.tsx
"use client";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Tambahkan ini

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok && !res?.error) {
      const session = await getSession();
      router.refresh(); 
      
      if (session?.user?.role === "ADMIN" || session?.user?.role === "OWNER") {
        router.push("/admin");
      } else {
        router.push("/"); // Pembeli dilempar ke Beranda
      }
    } else {
      alert("Login Gagal! Cek kembali email dan password Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-black text-center text-slate-900 mb-2">FROZEMART.</h1>
        <p className="text-center text-slate-500 text-sm mb-8">Masuk untuk mulai belanja</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition disabled:bg-slate-500"
          >
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
          </button>
        </form>

        {/* Tautan ke Daftar */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun? <Link href="/register" className="text-emerald-600 font-bold hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}