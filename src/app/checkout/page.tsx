// src/app/checkout/page.tsx
"use client";

import Navbar from "@/components/shared/Navbar";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, User, Phone, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // <-- PENANDA BARU
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
  });

  const shippingCost = cartItems.length > 0 ? 15000 : 0;
  const grandTotal = cartTotal + shippingCost;

  // PERBAIKAN: Jangan redirect ke beranda jika checkout baru saja berhasil (isSuccess === true)
  useEffect(() => {
    if (cartItems.length === 0 && !isLoading && !isSuccess) {
      router.push("/");
    }
  }, [cartItems.length, isLoading, isSuccess, router]);

  // Cegah render form jika keranjang kosong dan belum sukses
  if (cartItems.length === 0 && !isSuccess) {
    return null; 
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          totalAmount: grandTotal,
        }),
      });

      if (response.ok) {
        setIsSuccess(true); // Tandai bahwa pesanan sukses
        const data = await response.json();
        clearCart(); // Kosongkan keranjang
        alert("Pesanan berhasil dibuat! Silakan lakukan pembayaran.");
        
        // Sekarang redirect ke halaman pembayaran tidak akan dibajak ke Beranda
        router.push(`/order/${data.orderId}`);
      } else {
        alert("Terjadi kesalahan saat membuat pesanan.");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F9FD] pb-20 text-slate-800 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <CheckCircle className="text-blue-600" /> Selesaikan Pesanan
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Pengiriman */}
          <form onSubmit={handleCheckout} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-bold text-lg mb-4">Informasi Pengiriman</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><User size={14}/> Nama Lengkap</label>
              <input required type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} placeholder="Cth: Budi Santoso" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Phone size={14}/> Nomor WhatsApp</label>
              <input required type="tel" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} placeholder="Cth: 0812..." />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><MapPin size={14}/> Alamat Lengkap (Beserta Patokan)</label>
              <textarea required rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Cth: Jl. Mawar No 10, rumah pagar hitam..."></textarea>
            </div>

            <button disabled={isLoading} type="submit" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-md mt-4 disabled:opacity-50 transition-colors">
              {isLoading ? "Memproses..." : "Pesan Sekarang"}
            </button>
          </form>

          {/* Ringkasan */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="font-bold text-lg mb-4 border-b pb-4">Ringkasan Pesanan</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate mr-2">{item.quantity}x {item.name}</span>
                  <span className="font-semibold whitespace-nowrap">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>Ongkos Kirim</span><span>Rp 15.000</span></div>
              <div className="flex justify-between font-black text-lg text-slate-900 pt-2">
                <span>Total Bayar</span><span className="text-emerald-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}