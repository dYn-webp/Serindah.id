// src/app/admin/products/page.tsx
"use client"
import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
import AdminSidebar from "@/components/admin/Sidebar";
import AddProductModal from "@/components/admin/AddProductModal";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // State untuk simpan data dari DB
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data dari API yang kita buat sebelumnya
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal ambil data", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <main className="ml-64 flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manajemen Produk</h1>
            <p className="text-slate-500 text-sm">Total {products.length} produk terdaftar</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} /> Tambah Produk
          </button>
        </div>

        {/* Toolbar: Search & Filter (Tetap sama) */}
        <div className="bg-white p-4 rounded-t-2xl border border-slate-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input type="text" placeholder="Cari nama produk..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
          </div>
          <select className="bg-slate-50 border-none rounded-lg text-sm px-4 focus:ring-2 focus:ring-emerald-500">
            <option>Semua Kategori</option>
            <option>Ayam</option>
            <option>Daging</option>
          </select>
        </div>

        {/* Tabel Produk */}
        <div className="bg-white border border-slate-200 rounded-b-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Harga Modal</th>
                <th className="px-6 py-4">Harga Jual</th>
                <th className="px-6 py-4">Profit/Unit</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">Memuat data produk...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">Belum ada produk. Silakan tambah produk baru!</td>
                </tr>
              ) : (
                products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500">{item.category}</td>
                    <td className="px-6 py-4">Rp {item.costPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">Rp {item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">Rp {(item.price - item.costPrice).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md font-bold text-[11px] ${item.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                        {item.stock} unit
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16} /></button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <AddProductModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </main>
    </div>
  );
}