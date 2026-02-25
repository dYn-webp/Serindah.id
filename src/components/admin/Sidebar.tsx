// src/components/admin/Sidebar.tsx
"use client";
import { useState } from "react";
import { Package, ShoppingCart, LayoutDashboard, LogOut, Truck, PieChart, Image as ImageIcon, Menu, X } from "lucide-react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Pesanan", icon: ShoppingCart, path: "/admin/orders" },
  { name: "Produk", icon: Package, path: "/admin/products" },
  { name: "Keuangan", icon: PieChart, path: "/admin/finance" },
  { name: "Kelola Tampilan", icon: ImageIcon, path: "/admin/banners" },
  { name: "Pengaturan", icon: Truck, path: "/admin/shipping" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Hamburger - Muncul di HP (z-40) */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[40] p-2 bg-slate-900 text-white rounded-lg shadow-md"
      >
        <Menu size={24} />
      </button>

      {/* Overlay Gelap - Mengisi seluruh layar HP di bawah Sidebar (z-45) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-[45]"
          onClick={() => setIsOpen(false)} // Klik area gelap untuk tutup
        />
      )}

      {/* Kotak Sidebar Utama (z-50 agar paling depan) */}
      <div 
        className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-[50] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-black text-white tracking-tighter italic">
            FROZEMART <span className="text-emerald-500 underline">ADMIN</span>
          </h1>
          {/* Tombol Tutup (X) khusus untuk Mobile */}
          <button 
            type="button"
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsOpen(false)} // Tutup sidebar otomatis saat menu diklik (di HP)
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "hover:bg-slate-800 hover:text-emerald-400"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400"} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
}