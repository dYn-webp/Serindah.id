import AdminSidebar from "@/components/admin/Sidebar";
import { prisma } from "@/lib/prisma";
import FinanceChart from "@/components/admin/FinanceChart";

export default async function FinancePage() {
  // 1. Ambil semua pesanan yang SUDAH DIBAYAR atau SELESAI
  const validOrders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "SHIPPED", "COMPLETED"] }
    },
    orderBy: { createdAt: "asc" }
  });

  // 2. Hitung Total Pendapatan & Total Pesanan Sukses
  const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = validOrders.length;

  // 3. Kelompokkan data berdasarkan Tanggal untuk Grafik
  const groupedData: Record<string, number> = {};
  validOrders.forEach((order) => {
    // Ambil tanggalnya saja (YYYY-MM-DD)
    const dateStr = order.createdAt.toISOString().split("T")[0]; 
    if (!groupedData[dateStr]) {
      groupedData[dateStr] = 0;
    }
    groupedData[dateStr] += order.totalAmount;
  });

  // Ubah format data agar bisa dibaca oleh Recharts
  const chartData = Object.keys(groupedData).map((date) => {
    return {
      date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      revenue: groupedData[date]
    };
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Laporan Keuangan</h1>
          <p className="text-slate-500 text-sm">Analisis pendapatan dan performa penjualan toko Anda.</p>
        </header>

        {/* Kartu Ringkasan (KPA) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Pendapatan Kotor</p>
            <h2 className="text-3xl font-black text-slate-800">Rp {totalRevenue.toLocaleString('id-ID')}</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Pesanan Sukses</p>
            <h2 className="text-3xl font-black text-slate-800">{totalOrders} <span className="text-sm font-medium text-slate-400">Transaksi</span></h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-purple-500">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Rata-rata Transaksi</p>
            <h2 className="text-3xl font-black text-slate-800">
              Rp {totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString('id-ID') : 0}
            </h2>
          </div>
        </div>
        
        {/* Area Grafik */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Grafik Tren Penjualan</h3>
          <p className="text-sm text-slate-500 mb-6">Melihat pergerakan omzet dari pesanan yang sudah dibayar.</p>
          
          <FinanceChart data={chartData} />
        </div>
      </main>
    </div>
  );
}