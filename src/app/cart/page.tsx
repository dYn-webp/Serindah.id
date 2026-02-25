// src/app/cart/page.tsx
"use client";

import Navbar from "@/components/shared/Navbar";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  // Biaya ongkir flat sementara
  const shippingCost = cartItems.length > 0 ? 15000 : 0;
  const grandTotal = cartTotal + shippingCost;

  return (
    <main className="min-h-screen bg-[#F4F9FD] pb-20 text-slate-800 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <ShoppingBag className="text-blue-600" /> Keranjang Belanja
        </h1>

        {cartItems.length === 0 ? (
          // Tampilan jika keranjang kosong
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Keranjangmu masih kosong</h2>
            <p className="text-slate-500 mb-6 max-w-md">Yuk, cari frozen food favoritmu dan penuhi kulkas dengan makanan bergizi!</p>
            <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-md">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Daftar Produk di Keranjang */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center group">
                  
                  {/* Gambar Produk */}
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=150&h=150&fit=crop"} 
                    alt={item.name} 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-slate-50"
                  />
                  
                  {/* Info Produk */}
                  <div className="flex-1 flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-800 line-clamp-2 leading-snug">{item.name}</h3>
                      <div className="text-emerald-600 font-black text-sm md:text-lg mt-1">
                        Rp {item.price.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Tombol Hapus */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Belanja (Order Summary) */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
                <h2 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-4">Ringkasan Belanja</h2>
                
                <div className="space-y-3 text-sm text-slate-600 mb-6 border-b border-slate-100 pb-6">
                  <div className="flex justify-between">
                    <span>Total Harga ({cartItems.length} barang)</span>
                    <span className="font-medium text-slate-800">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Ongkos Kirim</span>
                    <span className="font-medium text-slate-800">Rp {shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center font-black text-lg md:text-xl text-slate-900 mb-6">
                  <span>Total Bayar</span>
                  <span className="text-emerald-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
                
                <Link href="/checkout" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-95">
                  Lanjut ke Pembayaran <ArrowRight size={18} />
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}