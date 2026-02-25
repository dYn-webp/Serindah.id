// src/app/order/[id]/invoice/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "@/components/admin/PrintButton"; // <-- Import tombolnya di sini

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Ambil data pesanan beserta produknya
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 font-sans print:bg-white print:py-0">
      
      <div className="bg-white p-10 md:p-12 w-full max-w-3xl shadow-lg print:shadow-none border border-gray-200 print:border-none relative">
        
        {/* Header Invoice */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              FROZE<span className="text-blue-600">MART</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Spesialis Frozen Food Berkualitas</p>
            <p className="text-xs text-slate-500">Jl. Contoh Alamat No. 123, Jakarta</p>
            <p className="text-xs text-slate-500">WA: 0812-3456-7890</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-blue-600 uppercase">INVOICE</h2>
            <p className="text-sm font-bold text-slate-700 mt-1">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-slate-500">Tanggal: {new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        {/* Data Pelanggan */}
        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 print:bg-transparent print:border-slate-300 print:rounded-none">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tujuan Pengiriman (Kepada):</h3>
          <p className="font-bold text-lg text-slate-900">{order.customerName}</p>
          <p className="text-sm text-slate-700 font-medium">{order.customerPhone}</p>
          <p className="text-sm text-slate-600 mt-1 max-w-md leading-relaxed">{order.address}</p>
        </div>

        {/* Tabel Produk */}
        <table className="w-full text-left mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="py-3 text-sm font-bold text-slate-700">Nama Produk</th>
              <th className="py-3 text-sm font-bold text-slate-700 text-center">Qty</th>
              <th className="py-3 text-sm font-bold text-slate-700 text-right">Harga Satuan</th>
              <th className="py-3 text-sm font-bold text-slate-700 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-4 text-sm font-medium text-slate-800">{item.product.name}</td>
                <td className="py-4 text-sm font-bold text-slate-800 text-center">{item.quantity}</td>
                <td className="py-4 text-sm text-slate-600 text-right">Rp {item.price.toLocaleString('id-ID')}</td>
                <td className="py-4 text-sm font-bold text-slate-900 text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Harga */}
        <div className="flex justify-end mb-12">
          <div className="w-full md:w-1/2 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal Produk</span>
              <span>Rp {(order.totalAmount - 15000).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Ongkos Kirim (Flat)</span>
              <span>Rp 15.000</span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-slate-200 pt-3">
              <span className="font-bold text-slate-800">TOTAL BAYAR</span>
              <span className="text-xl font-black text-emerald-600">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-6">
          <p>Terima kasih telah berbelanja di Frozemart!</p>
          <p>Harap simpan struk ini sebagai bukti pembayaran dan pengiriman yang sah.</p>
        </div>

      </div>

      {/* SUNTIKAN CSS LANGSUNG (Memaksa Browser Menyembunyikan Tombol Saat Print) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            #area-tombol-cetak {
              display: none !important;
            }
          }
        `
      }} />

      {/* Tambahkan id="area-tombol-cetak" ke div ini */}
      <div id="area-tombol-cetak" className="fixed bottom-8 right-8">
        <PrintButton />
      </div>

    </div>
  );
}