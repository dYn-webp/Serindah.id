// src/app/admin/orders/page.tsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Eye, X } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const confirmUpdate = confirm("Yakin ingin mengubah status pesanan ini?");
    if (!confirmUpdate) return;

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert("Status pesanan berhasil diperbarui!");
        fetchOrders(); 
      } else {
        alert("Gagal memperbarui status.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    /* PERBAIKAN: Hapus "flex", cukup gunakan min-h-screen dan warna background */
    <div className="min-h-screen bg-slate-50 font-sans block">
      <Sidebar />
      
      {/* PERBAIKAN: Hapus flex-1 dan w-full. Cukup atur padding dan margin (md:ml-64) */}
      <main className="p-5 pt-20 md:p-8 md:ml-64 transition-all duration-300">
        
        <header className="mb-8 pl-12 md:pl-0">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Manajemen Pesanan</h1>
          <p className="text-sm text-slate-500 mt-1">Cek bukti transfer dan perbarui status pengiriman.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="p-4 font-bold border-b">ID & Info Pelanggan</th>
                  <th className="p-4 font-bold border-b">Total Bayar</th>
                  <th className="p-4 font-bold border-b">Bukti Transfer</th>
                  <th className="p-4 font-bold border-b">Status Saat Ini</th>
                  <th className="p-4 font-bold border-b text-center">Ubah Status</th>
                  <th className="p-4 font-bold border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">Memuat data pesanan...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada pesanan masuk.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</div>
                        <div className="text-sm text-slate-700">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                        <div className="text-xs text-slate-400 mt-1 truncate max-w-[200px]">{order.address}</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-600 whitespace-nowrap">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        {order.paymentProof ? (
                          <button 
                            onClick={() => setSelectedImage(order.paymentProof)}
                            className="flex items-center gap-1 text-xs md:text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-bold transition-colors whitespace-nowrap"
                          >
                            <Eye size={16} /> Cek Bukti
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic font-medium whitespace-nowrap">Belum Upload</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full whitespace-nowrap ${
                          order.status === 'PENDING' ? 'bg-slate-100 text-slate-600' :
                          order.status === 'VERIFYING' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'PACKING' ? 'bg-orange-100 text-orange-700' :
                          order.status === 'SHIPPING' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status === 'PENDING' ? 'BELUM BAYAR' :
                           order.status === 'VERIFYING' ? 'VERIFIKASI ADMIN' :
                           order.status === 'PACKING' ? 'DIPACKING' :
                           order.status === 'SHIPPING' ? 'PERJALANAN' : 'SELESAI'}
                        </span>
                      </td>
                      <td className="p-4">
                         <div className="flex justify-center">
                            <select 
                              className="text-xs border border-slate-200 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              disabled={updatingId === order.id}
                            >
                              <option value="PENDING">Belum Bayar</option>
                              <option value="VERIFYING">Verifikasi Bukti</option>
                              <option value="PACKING">Proses Packing</option>
                              <option value="SHIPPING">Perjalanan (Kirim)</option>
                              <option value="COMPLETED">Selesai Diterima</option>
                            </select>
                         </div>
                      </td>
                      <td className="p-4 text-center">
                        <a 
                          href={`/order/${order.id}/invoice`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap"
                        >
                          🖨️ Cetak
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL GAMBAR BUKTI TRANSFER */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-3xl p-5 md:p-6 max-w-lg w-full relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Foto Bukti Transfer</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex justify-center bg-slate-50 rounded-xl p-2 border border-slate-100">
              <img 
                src={selectedImage} 
                alt="Bukti Transfer" 
                className="max-h-[65vh] w-auto rounded-lg object-contain" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}