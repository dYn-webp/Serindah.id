// src/app/history/page.tsx
"use client";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";
import { Search, Clock, CheckCircle, AlertCircle, Upload } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/history?phone=${phone}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      alert("Gagal mencari pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9FD] pb-20 text-slate-800 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Search className="text-blue-600" /> Lacak Pesanan Saya
        </h1>

        {/* Form Pencarian */}
        <form onSubmit={searchOrders} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-8">
          <input 
            type="tel" 
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Masukkan Nomor WhatsApp Anda (Cth: 0812...)" 
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? "Mencari..." : "Cari Pesanan"}
          </button>
        </form>

        {/* Hasil Pencarian */}
        {hasSearched && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl shadow-sm text-center border border-slate-100">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-700">Pesanan tidak ditemukan</h3>
                <p className="text-slate-500 text-sm">Pastikan nomor WhatsApp yang dimasukkan sama dengan saat memesan.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">ID: #{order.id.slice(-6)}</span>
                      
                      {/* Badge Status */}
                      {order.status === "PENDING" && <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1"><Clock size={12}/> BELUM DIBAYAR</span>}
                      {order.status === "VERIFYING" && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1"><Clock size={12}/> MENUNGGU VERIFIKASI ADMIN</span>}
                      {order.status === "PACKING" && <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12}/> SEDANG DIPACKING</span>}
                      {order.status === "SHIPPING" && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12}/> DALAM PERJALANAN PENGIRIMAN</span>}
                      {order.status === "COMPLETED" && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12}/> PESANAN SELESAI</span>}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 mb-1">{order.items.length} Barang Belanjaan</h3>
                    <p className="text-emerald-600 font-black">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(order.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  {/* Tombol Aksi Berdasarkan Status */}
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    {order.status === "PENDING" && (
                      <Link href={`/order/${order.id}`} className="bg-orange-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-orange-600 text-center flex items-center justify-center gap-2 shadow-sm">
                        <Upload size={16} /> Upload Bukti
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}