// src/app/(auth)/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      alert("Pendaftaran berhasil! Silakan masuk.");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error || "Pendaftaran gagal");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-slate-100">
        <h1 className="text-2xl font-black text-center text-slate-900 mb-2">FROZEMART.</h1>
        <p className="text-center text-slate-500 text-sm mb-8">Daftar akun pembeli baru</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Nama Lengkap" required
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" placeholder="Email" required
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required minLength={6}
            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={isLoading}
            className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition disabled:bg-slate-500"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun? <Link href="/login" className="text-emerald-600 font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}