// src/components/customer/ProductCard.tsx
"use client"; 
import { ShoppingCart, Heart, Star } from "lucide-react";
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
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); // Mencegah bentrok jika card ini dibungkus link URL
    addToCart({ id, name, price, image });
    alert(`${name} berhasil ditambahkan ke keranjang!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-3 flex flex-col relative group transition-all h-full">
      {/* Tombol Wishlist (Opsional/Estetika) */}
      <button className="absolute top-4 right-4 z-10 text-gray-300 hover:text-red-500 transition-colors bg-white/80 p-1.5 rounded-xl backdrop-blur-sm">
        <Heart size={18} />
      </button>

      {/* Badge Promo */}
      <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-xl z-10 shadow-sm">
        PROMO
      </div>

      {/* Area Gambar Produk */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square mb-3">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          onError={(e) => {
            // Jika gambar dari database error/kosong, otomatis ganti ke gambar default ini
            e.currentTarget.src = "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=300&h=300&fit=crop";
          }}
        />
      </div>

      {/* Detail Text Produk */}
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 flex-1">{name}</h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            <Star size={12} fill="currentColor" stroke="none" />
            <Star size={12} fill="currentColor" stroke="none" />
            <Star size={12} fill="currentColor" stroke="none" />
            <Star size={12} fill="currentColor" stroke="none" />
            <Star size={12} fill="currentColor" stroke="none" />
          </div>
          <span className="text-[10px] text-gray-500">Terjual 1k+</span>
        </div>

        {/* Harga & Tombol Beli */}
        <div className="flex justify-between items-end mt-auto pt-2">
          <div>
            <div className="text-xs text-orange-500 font-medium mb-0.5">Sisa {stock}</div>
            <div className="text-sm text-gray-400 line-through mb-0.5">Rp {(price + 15000).toLocaleString('id-ID')}</div>
            <div className="text-lg font-bold text-gray-900">Rp {price.toLocaleString('id-ID')}</div>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-xl bg-orange-100 text-orange-500 hover:bg-orange-500 hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}