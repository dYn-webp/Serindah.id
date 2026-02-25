// src/app/order/[id]/page.tsx
"use client";
import Navbar from "@/components/shared/Navbar";
import { useState, use } from "react"; // <-- Tambahkan 'use' dari react
import { Upload, CheckCircle, Copy, Wallet } from "lucide-react";

export default function OrderPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  // Buka (unwrap) params menggunakan React.use() sesuai standar Next.js 15
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [proof, setProof] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fungsi mengubah gambar jadi base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProof(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!proof) return alert("Pilih foto bukti transfer dulu!");
    setIsUploading(true);

    try {
      // Gunakan orderId yang sudah di-unwrap
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentProof: proof }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengunggah bukti.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#F4F9FD] text-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-md text-center max-w-md w-full border border-slate-100">
          <CheckCircle className="text-emerald-500 w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-2">Bukti Terkirim!</h1>
          <p className="text-slate-500 mb-6">Terima kasih. Admin kami akan segera memverifikasi pembayaran Anda dan memproses pesanan.</p>
          <a href="/history" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-block">
            Lihat Status Pesanan
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F9FD] pb-20 text-slate-800 font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Wallet className="text-blue-600" /> Selesaikan Pembayaran
          </h1>
          
          <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
            <p className="text-sm text-blue-800 mb-2">Silakan transfer sesuai total belanja Anda ke rekening berikut:</p>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100 mb-2">
              <span className="font-bold text-slate-700">BCA - 1234567890</span>
              <span className="text-sm text-slate-500">a.n Frozemart F&B</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-100">
              <span className="font-bold text-slate-700">Mandiri - 0987654321</span>
              <span className="text-sm text-slate-500">a.n Frozemart F&B</span>
            </div>
            <p className="text-xs text-red-500 mt-2 font-medium">*Jangan lupa simpan resi bukti transfer Anda.</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-700">Upload Bukti Transfer</h3>
            
            <label className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {proof ? (
                <img src={proof} alt="Bukti Transfer" className="h-40 object-contain rounded-lg" />
              ) : (
                <>
                  <Upload className="text-slate-400 w-10 h-10 mb-2" />
                  <span className="text-sm text-slate-500 font-medium">Klik untuk pilih gambar (JPG, PNG)</span>
                </>
              )}
            </label>

            <button 
              onClick={handleUpload} 
              disabled={isUploading || !proof}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-md disabled:opacity-50 transition-colors"
            >
              {isUploading ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}