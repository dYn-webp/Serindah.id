// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/admin/Sidebar";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  // Mengambil ringkasan data dari database
  const totalProducts = await prisma.product.count();
  
  const totalOrders = await prisma.order.count();
  
  // Menghitung total pendapatan dari pesanan yang sudah dibayar (asumsi status "PAID" atau "DELIVERED")
  // Untuk sementara kita hitung semua pesanan untuk demo
  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Ambil 5 pesanan terbaru
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-y-auto ml-64">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Selamat datang kembali, Admin Frozemart!</p>
        </header>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Pendapatan</p>
              <h2 className="text-2xl font-black text-slate-900">Rp {totalRevenue.toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingCart size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Pesanan</p>
              <h2 className="text-2xl font-black text-slate-900">{totalOrders} Pesanan</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Package size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Produk</p>
              <h2 className="text-2xl font-black text-slate-900">{totalProducts} Produk</h2>
            </div>
          </div>
        </div>

        {/* Tabel Pesanan Terbaru */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} /> Pesanan Terbaru
            </h2>
            <a href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua</a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-bold border-b border-slate-100">ID Pesanan</th>
                  <th className="p-4 font-bold border-b border-slate-100">Pelanggan</th>
                  <th className="p-4 font-bold border-b border-slate-100">Total</th>
                  <th className="p-4 font-bold border-b border-slate-100">Status</th>
                  <th className="p-4 font-bold border-b border-slate-100">Tanggal</th>
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
                      <td className="p-4 text-sm font-medium text-slate-900">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="p-4 text-sm text-slate-700">
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                      </td>
                      <td className="p-4 text-sm font-bold text-emerald-600">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'PAID' ? 'bg-blue-100 text-blue-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
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