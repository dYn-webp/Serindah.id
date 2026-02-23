// src/components/admin/AddProductModal.tsx
"use client"
import React, { useState } from 'react';
import { X, Save, Calculator } from "lucide-react";
import { useRouter } from "next/navigation"; // Tambahkan ini

export default function AddProductModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); // State loading
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0
  });

  if (!isOpen) return null;

  const profit = formData.sellingPrice - formData.costPrice;

  // Fungsi untuk mengirim data ke Database
  const handleSave = async () => {
    // Validasi sederhana
    if (!formData.name || !formData.category) {
      alert("Nama dan Kategori wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Produk berhasil ditambahkan!");
        onClose(); // Tutup modal
        router.refresh(); // Refresh halaman agar data baru muncul
      } else {
        alert("Gagal menyimpan produk.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Tambah Produk Baru</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Form Body (Isinya sama seperti sebelumnya) */}
        <div className="p-8 space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Nama Produk</label>
            <input 
              type="text" 
              placeholder="Contoh: Nugget Ayam Fiesta 500g"
              className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
              <select 
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Pilih Kategori</option>
                <option value="Ayam">Olahan Ayam</option>
                <option value="Daging">Olahan Daging</option>
                <option value="Ikan">Olahan Ikan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Stok Awal</label>
              <input 
                type="number" 
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div>
              <label className="text-[10px] font-bold text-emerald-700 uppercase">Harga Modal (Rp)</label>
              <input 
                type="number" 
                placeholder="25000"
                className="w-full mt-1 bg-transparent border-b border-emerald-200 font-bold text-emerald-900 outline-none focus:border-emerald-500"
                onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-emerald-700 uppercase">Harga Jual (Rp)</label>
              <input 
                type="number" 
                placeholder="35000"
                className="w-full mt-1 bg-transparent border-b border-emerald-200 font-bold text-emerald-900 outline-none focus:border-emerald-500"
                onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})}
              />
            </div>
          </div>

          {/* Profit Indicator */}
          <div className="flex items-center justify-between px-2 text-sm">
            <span className="flex items-center gap-2 text-slate-500"><Calculator size={16}/> Estimasi Profit:</span>
            <span className={`font-black ${profit > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              Rp {profit.toLocaleString()} / Unit
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:text-slate-700 transition">Batal</button>
          
          {/* Ubah tombol simpan agar memanggil fungsi handleSave */}
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Save size={18} /> {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}