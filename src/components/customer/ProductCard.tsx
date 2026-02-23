// src/components/customer/ProductCard.tsx
"use client"; // Wajib ditambahkan karena ada interaksi tombol
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export function ProductCard({ id, name, price, stock, category, image }: ProductCardProps) {
  const { addToCart } = useCart(); // Ambil fungsi tambah ke keranjang

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah pindah halaman jika kartu dibungkus Link nanti
    addToCart({ id, name, price, image });
    alert(`${name} berhasil ditambahkan ke keranjang!`); // Notifikasi sementara
  };

  return (
    <div className="bg-white border-r border-b border-slate-100 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 relative group cursor-pointer flex flex-col h-full">
      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 z-10 rounded-bl-lg shadow-sm">
        15% OFF
      </div>

      <div className="aspect-square bg-slate-50 overflow-hidden relative">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          {/* Tambahkan onClick di tombol ini */}
          <button 
            onClick={handleAddToCart}
            className="bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 hover:scale-105 transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0"
          >
            <ShoppingCart size={14} /> Tambah
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug mb-1">{name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-600 font-bold text-lg">Rp {price.toLocaleString('id-ID')}</span>
            <span className="text-[10px] text-slate-400 line-through">Rp {(price + 15000).toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="mt-2">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
             <div className="bg-emerald-500 h-full w-3/4 rounded-full" />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span className="uppercase font-bold text-emerald-600">Sisa {stock}</span>
            <span>1.2rb Terjual</span>
          </div>
        </div>
      </div>
    </div>
  );
}