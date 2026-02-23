// src/components/shared/Navbar.tsx
"use client";
import React from 'react';
import { ShoppingCart, Search, Bell, HelpCircle } from "lucide-react";
import Link from "next/link"; 
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm w-full">
      {/* Top Bar - Dikecilkan padding & font-nya di HP */}
      <div className="bg-slate-900 text-white text-[9px] md:text-[11px] py-1.5 px-2 md:px-4">
        <div className="max-w-7xl mx-auto flex justify-end gap-3 md:gap-4">
          <span className="hover:text-emerald-400 cursor-pointer flex items-center gap-1">
            <Bell size={10} className="md:w-3 md:h-3"/> <span className="hidden md:inline">Notifikasi</span>
          </span>
          <span className="hover:text-emerald-400 cursor-pointer flex items-center gap-1">
            <HelpCircle size={10} className="md:w-3 md:h-3"/> <span className="hidden md:inline">Bantuan</span>
          </span>
          <Link href="/login" className="font-bold border-l border-slate-600 pl-3 md:pl-4 cursor-pointer hover:text-emerald-400 transition-colors">
            Masuk / Daftar
          </Link>
        </div>
      </div>

      {/* Main Bar - Penyesuaian gap dan ukuran font untuk HP */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-6">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter uppercase cursor-pointer">
              FROZE<span className="text-emerald-500 hidden md:inline">MART</span>
              {/* Di HP kita hanya tampilkan "FROZE" atau dot hijau agar hemat tempat */}
              <span className="text-emerald-500 md:hidden">.</span> 
            </h1>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="flex bg-slate-100/80 rounded-lg p-1 border-2 border-transparent focus-within:border-emerald-500 transition-all">
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full bg-transparent px-2 md:px-4 py-1.5 md:py-2 outline-none text-xs md:text-sm text-slate-700"
            />
            <button className="bg-emerald-500 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-md hover:bg-emerald-600 transition flex items-center justify-center">
              <Search size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>

        {/* Ikon Keranjang */}
        <Link href="/cart" className="relative group cursor-pointer pr-1 md:pr-4 flex-shrink-0">
          <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-slate-700 group-hover:text-emerald-500 transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-0 md:right-2 bg-emerald-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>
        
      </div>
    </nav>
  );
}