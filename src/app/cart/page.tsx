// src/app/cart/page.tsx
"use client";
import Navbar from "@/components/shared/Navbar";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast"; // Notifikasi elegan
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();
  
  // State untuk form
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [isLoading, setIsLoading] = useState(false);

  // FUNGSI CHECKOUT
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error("Keranjang kosong!");
    if (!formData.name || !formData.phone || !formData.address) {
      return toast.error("Mohon lengkapi data pengiriman!");
    }

    setIsLoading(true);
    const toastId = toast.loading("Memproses pesanan...");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          address: formData.address,
          cartItems: cartItems,
          cartTotal: cartTotal,
        }),
      });

      if (res.ok) {
        toast.success("Pesanan Berhasil Dibuat!", { id: toastId });
        
        // PANGGIL FUNGSI INI UNTUK MENGOSONGKAN KERANJANG
        clearCart(); 
        
        setTimeout(() => {
          router.push("/"); // Kembali ke beranda dengan mulus
        }, 2000);
      } else {
        throw new Error("Gagal proses");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] pb-20 text-slate-800">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition mb-6 w-fit font-medium">
          <ArrowLeft size={18} /> Kembali Belanja
        </Link>

        <h1 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Keranjang Belanja</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-100 text-center flex flex-col items-center justify-center shadow-sm">
            <ShoppingBag size={64} className="text-slate-200 mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">Keranjang Anda masih kosong</h2>
            <p className="text-slate-500 mb-6">Yuk, cari frozen food favorit Anda sekarang!</p>
            <Link href="/" className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 transition shadow-md">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DAFTAR BARANG */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center transition hover:shadow-md">
                  <img src={item.image} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border bg-slate-50" alt={item.name} />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 line-clamp-2 text-sm md:text-base">{item.name}</h3>
                    <p className="text-emerald-600 font-bold mt-1 text-sm md:text-base">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  
                  {/* Kontrol Jumlah */}
                  <div className="flex items-center gap-2 md:gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 font-bold hover:text-emerald-600 hover:border-emerald-200 border border-transparent">-</button>
                    <span className="w-4 text-center font-bold text-xs md:text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 font-bold hover:text-emerald-600 hover:border-emerald-200 border border-transparent">+</button>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-1 md:ml-2">
                    <Trash2 size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* FORM PENGIRIMAN & RINGKASAN */}
            <div className="lg:col-span-1">
              <form onSubmit={handleCheckout} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
                <h2 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4 flex items-center gap-2">
                  📍 Informasi Pengiriman
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Nama Penerima</label>
                    <input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} placeholder="Cth: Budi Santoso" className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Nomor WhatsApp</label>
                    <input type="tel" required value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} placeholder="Cth: 08123456789" className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Alamat Lengkap</label>
                    <textarea rows={3} required value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} placeholder="Nama jalan, RT/RW, patokan rumah..." className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm resize-none"></textarea>
                  </div>
                </div>

                <h2 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">🧾 Ringkasan Belanja</h2>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Harga ({cartCount} barang)</span>
                    <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Dihitung otomatis</span>
                  </div>
                  <div className="flex justify-between font-black text-lg pt-3 border-t border-slate-100 text-slate-900">
                    <span>Total Tagihan</span>
                    <span className="text-emerald-600">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button disabled={isLoading} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                  {isLoading ? "Memproses..." : "Lanjut Pembayaran"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}