import AdminSidebar from "@/components/admin/Sidebar";

export default function ShippingPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Status Pengiriman</h1>
          <p className="text-slate-500 text-sm">Pantau proses pengiriman barang ke pelanggan.</p>
        </header>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-center py-10">Data dan resi pengiriman akan ditampilkan di sini.</p>
        </div>
      </main>
    </div>
  );
}