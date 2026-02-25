// src/app/admin/orders/page.tsx
import AdminSidebar from "@/components/admin/Sidebar";
import { prisma } from "@/lib/prisma";
import OrderStatusButton from "@/components/admin/OrderStatusButton"; // Pastikan file ini sudah dibuat sebelumnya

export default async function OrdersPage() {
  // Ambil data pesanan dari database, urutkan dari yang terbaru
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true // Ambil detail nama produk di dalam pesanan
        }
      }
    }
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Daftar Pesanan Masuk</h1>
          <p className="text-slate-500 text-sm">Kelola pesanan pelanggan dan perbarui status pengiriman.</p>
        </header>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          {orders.length === 0 ? (
             <div className="text-center py-16">
               <span className="text-4xl mb-4 block">📦</span>
               <p className="text-slate-500 font-medium">Belum ada pesanan masuk.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="p-4 font-bold rounded-tl-lg">Pelanggan</th>
                    <th className="p-4 font-bold">Kontak & Alamat</th>
                    <th className="p-4 font-bold">Ringkasan Pesanan</th>
                    <th className="p-4 font-bold">Total Tagihan</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold rounded-tr-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </td>
                      <td className="p-4 max-w-[200px]">
                        <p className="font-medium text-emerald-600">{order.customerPhone}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5" title={order.address}>{order.address}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800 font-bold text-xs">{order.items.length} macam barang</p>
                        <ul className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                          {/* @ts-ignore */}
                          {order.items.slice(0, 2).map((item) => (
                            <li key={item.id}>• {item.quantity}x {item.product.name}</li>
                          ))}
                          {order.items.length > 2 && <li className="italic text-slate-400">...dan lainnya</li>}
                        </ul>
                      </td>
                      <td className="p-4 font-black text-slate-800">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <OrderStatusButton 
                          orderId={order.id} 
                          currentStatus={order.status} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}