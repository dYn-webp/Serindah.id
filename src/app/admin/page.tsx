// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/admin/Sidebar";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link"; // <--- TAMBAHKAN BARIS INI

export default async function AdminDashboard() {

  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  
  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      
      {/* Margin-left 64 hanya berlaku di layar Medium (Desktop) ke atas */}
      <main className="p-4 pt-24 md:p-10 md:ml-64 transition-all duration-300">
        
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, Admin Frozemart!</p>
        </header>

        {/* Grid Stats: 1 kolom di HP, 3 kolom di Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Rp {totalRevenue.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingCart size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pesanan</p>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">{totalOrders} Pesanan</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Package size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Produk</p>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">{totalProducts} Produk</h2>
            </div>
          </div>
        </div>

        {/* Tabel Pesanan Terbaru */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-base md:text-lg text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} /> Pesanan Terbaru
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-blue-600 hover:bg-blue-100 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
              Lihat Semua
            </Link>
          </div>
          
          {/* Scroll Horizontal hanya pada tabel jika layar terlalu sempit */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white text-slate-400 text-[11px] uppercase tracking-widest border-b border-slate-100">
                  <th className="p-5 font-bold">ID Pesanan</th>
                  <th className="p-5 font-bold">Pelanggan</th>
                  <th className="p-5 font-bold">Total</th>
                  <th className="p-5 font-bold">Status</th>
                  <th className="p-5 font-bold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 italic">Belum ada pesanan masuk.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                      <td className="p-5 text-sm font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="p-5 text-sm">
                        <div className="font-bold text-slate-800">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="p-5 text-sm font-black text-emerald-600">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'PAID' ? 'bg-blue-100 text-blue-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </main>
    </div>
  );
}