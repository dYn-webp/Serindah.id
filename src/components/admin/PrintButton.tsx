// src/components/admin/PrintButton.tsx
"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      // Kita pakai class 'sembunyikan-saat-print' yang baru kita buat 👇
      className="sembunyikan-saat-print bg-blue-600 text-white font-bold px-6 py-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
    >
      🖨️ Cetak Resi
    </button>
  );
}