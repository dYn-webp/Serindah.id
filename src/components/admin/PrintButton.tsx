// src/components/admin/PrintButton.tsx
"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-blue-600 text-white font-bold px-6 py-4 rounded-full shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
    >
      🖨️ Cetak Resi
    </button>
  );
}