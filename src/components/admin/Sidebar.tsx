// src/components/admin/Sidebar.tsx
"use client";
import { Package, ShoppingCart, LayoutDashboard, LogOut, Truck, PieChart, Image as ImageIcon } from "lucide-react"; 
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
  const pathname = usePathname(); // Untuk menandai menu mana yang sedang aktif

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-xl font-black text-white tracking-tighter italic">
          FROZEMART <span className="text-emerald-500 underline">ADMIN</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
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