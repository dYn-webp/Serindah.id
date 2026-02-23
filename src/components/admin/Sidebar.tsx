// src/components/admin/Sidebar.tsx
"use client" // Tambahkan ini karena kita pakai onClick
import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, Truck } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react"; // Tambahkan import ini untuk fitur Keluar

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
  { icon: <Package size={20} />, label: "Produk", href: "/admin/products" },
  { icon: <ShoppingCart size={20} />, label: "Pesanan", href: "/admin/orders" },
  { icon: <Truck size={20} />, label: "Pengiriman", href: "/admin/shipping" },
  { icon: <BarChart3 size={20} />, label: "Laporan Keuangan", href: "/admin/finance" },
];

export default function AdminSidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-black text-white tracking-tighter italic">
          FROZEMART <span className="text-emerald-500 underline">ADMIN</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-emerald-400 transition-all group"
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {/* PERBAIKAN: Tambahkan onClick={() => signOut()} di tombol ini */}
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}