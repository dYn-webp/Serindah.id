// src/components/customer/ProductCard.tsx
"use client";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export function ProductCard({ id, name, price, stock, category, image }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addToCart({ id, name, price, image });
    toast.success(`${name} masuk ke keranjang`, {
        style: { 
          borderRadius: '12px', 
          background: '#ea580c', /* orange-600 */
          color: '#fff', 
          fontSize: '13px',
          fontWeight: '500'
        },
        iconTheme: { primary: '#ffedd5', secondary: '#ea580c' }, /* orange-100 & orange-600 */
    });
  };

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Gambar & Label */}
      <div className="relative aspect-[4/3] overflow-hidden bg-orange-50/50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-orange-600 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
          {category}
        </span>
      </div>

      {/* Informasi Produk */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Nama dan Berat (Opsional) */}
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-orange-500 transition-colors">
            {name}
          </h3>
          {/* Anda bisa menyesuaikan deskripsi berat ini dengan data dinamis jika ada */}
          <p className="text-[11px] font-medium text-slate-400">Kemasan Praktis</p>
        </div>

        <div className="mt-auto">
          {/* Harga dan Ketersediaan Stok */}
          <div className="flex items-end justify-between mb-4">
             <div>
                <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Harga</span>
                <div className="text-orange-500 font-black text-[16px] leading-none">
                  Rp {price.toLocaleString('id-ID')}
                </div>
             </div>
             <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${stock > 0 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-500'}`}>
                  {stock > 0 ? `Sisa: ${stock}` : 'Habis'}
                </span>
             </div>
          </div>

          {/* Tombol Add to Cart (Oranye Segar) */}
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-400 text-white py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <ShoppingBag size={16} />
            {stock > 0 ? '+ Keranjang' : 'Stok Kosong'}
          </button>
        </div>
      </div>
    </div>
  );
}