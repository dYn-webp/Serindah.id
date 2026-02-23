// src/app/admin/page.tsx
import AdminSidebar from "@/components/admin/Sidebar";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  AlertCircle, 
  ShoppingCart 
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ringkasan Bisnis</h1>
            <p className="text-slate-500 text-sm">Update terakhir: Hari ini</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
            Download Laporan
          </button>
        </header>

        {/* Statistik Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Omzet" value="Rp 12.500.000" icon={<DollarSign className="text-emerald-600" />} grow="+12%" />
          <StatCard title="Profit Bersih" value="Rp 4.200.000" icon={<TrendingUp className="text-blue-600" />} grow="+8%" />
          <StatCard title="Total Pesanan" value="142" icon={<ShoppingCart className="text-purple-600" />} grow="+24%" />
          <StatCard title="Stok Menipis" value="5 Item" icon={<AlertCircle className="text-red-600" />} isAlert={true} />
        </div>

        {/* Konten Utama */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
            <h3 className="font-bold text-slate-800 mb-4">Grafik Penjualan 7 Hari Terakhir</h3>
            <div className="h-full w-full bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200 min-h-[200px]">
               <p className="text-slate-400">Area Chart Penjualan (Akan diisi Recharts)</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Pesanan Terbaru</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 border-b border-slate-50 pb-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-slate-600">#{i}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">Budi Santoso</p>
                    <p className="text-[10px] text-slate-400">Nugget, Sosis ...</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">Lunas</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Tambahkan definisi TypeScript untuk props StatCard
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  grow?: string;
  isAlert?: boolean;
}

function StatCard({ title, value, icon, grow, isAlert }: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${isAlert ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        {grow && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{grow}</span>}
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h2 className={`text-xl font-black mt-1 ${isAlert ? 'text-red-600' : 'text-slate-900'}`}>{value}</h2>
    </div>
  );
}