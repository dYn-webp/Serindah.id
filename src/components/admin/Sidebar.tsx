// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/admin/Sidebar";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-slate-50 font-sans block">
      <Sidebar />
      
      {/* - pt-20: Memberikan ruang di atas pada layar HP agar tidak tertutup tombol Hamburger.
        - md:ml-64: Mendorong konten ke kanan seukuran lebar Sidebar pada mode desktop.
        - md:pt-8: Mengembalikan padding atas ke ukuran normal di desktop.
      */}
      <main className="p-5 pt-20 md:p-8 md:pt-8 md:ml-64 transition-all duration-300 w-full min-w-0">
        
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, Admin Frozemart!</p>
        </header>

        {/* Grid statistik menyesuaikan layar: 1 kolom (HP) -> 3 kolom (Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Total Pendapatan</p>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">Rp {totalRevenue.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingCart size={28} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Total Pesanan</p>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">{totalOrders} Pesanan</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Package size={28} />
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">Total Produk</p>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">{totalProducts} Produk</h2>
            </div>
          </div>
        </div>

        {/* Area Tabel Pesanan Terbaru */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full">
          <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-base md:text-lg text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} /> Pesanan Terbaru
            </h2>
            <Link href="/admin/orders" className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
              Lihat Semua
            </Link>
          </div>
          
          {/* overflow-x-auto sangat penting di sini agar tabel tidak merusak layout layar kecil */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white text-slate-500 text-xs md:text-sm border-b border-slate-100">
                  <th className="p-4 font-bold">ID Pesanan</th>
                  <th className="p-4 font-bold">Pelanggan</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada pesanan masuk.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                      <td className="p-4 text-xs md:text-sm font-medium text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-xs md:text-sm text-slate-700">
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-[10px] md:text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 text-xs md:text-sm font-bold text-emerald-600">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'PAID' ? 'bg-blue-100 text-blue-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs md:text-sm text-slate-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
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