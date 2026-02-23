// src/app/page.tsx
import Navbar from "@/components/shared/Navbar";
import { ProductCard } from "@/components/customer/ProductCard";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client"; // <--- 1. TAMBAHKAN BARIS INI

export default async function Home() {
  // MENGAMBIL DATA PRODUK ASLI DARI DATABASE (Tampilkan 12 produk terbaru)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  return (
    <main className="min-h-screen bg-[#F5F5F5] pb-20 text-slate-800">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-4 md:mt-6">
        {/* Hero Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-[300px]">
          <div className="md:col-span-2 h-[180px] md:h-full bg-slate-800 rounded-lg overflow-hidden relative group cursor-pointer shadow-sm">
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent z-10 p-6 md:p-10 flex flex-col justify-center">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-2">PROMO SPESIAL</span>
                <h2 className="text-white text-2xl md:text-4xl font-black mb-1 md:mb-2 uppercase tracking-tight">Pesta Bakso & Nugget</h2>
                <p className="text-emerald-400 font-medium text-sm md:text-base">Diskon hingga 50% khusus pesanan hari ini!</p>
             </div>
             <img src="https://images.unsplash.com/photo-1547050605-2f267027376a?q=80&w=800&h=400&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80" alt="Main Banner" />
          </div>
          <div className="flex flex-row md:flex-col gap-2 h-[100px] md:h-full">
            <div className="w-1/2 md:w-full h-full md:h-1/2 bg-emerald-100 rounded-lg overflow-hidden cursor-pointer shadow-sm relative group">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10" />
               <img src="https://images.unsplash.com/photo-1585325701165-351af9ad665e?q=80&w=400&h=200&fit=crop" className="w-full h-full object-cover" alt="Sub Banner 1" />
            </div>
            <div className="w-1/2 md:w-full h-full md:h-1/2 bg-blue-100 rounded-lg overflow-hidden cursor-pointer shadow-sm relative group">
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10" />
               <img src="https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400&h=200&fit=crop" className="w-full h-full object-cover" alt="Sub Banner 2" />
            </div>
          </div>
        </div>

        {/* Section Kategori */}
        <div className="bg-white mt-4 md:mt-6 p-4 md:p-6 rounded-lg shadow-sm grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
          {['Ayam', 'Daging', 'Ikan', 'Sosis', 'Bakso', 'Kentang', 'Sayur', 'Paket'].map((cat) => (
            <div key={cat} className="group cursor-pointer">
              <div className="w-10 h-10 md:w-14 md:h-14 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all shadow-sm group-hover:shadow-md">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 transition-colors" />
              </div>
              <p className="text-[10px] md:text-[12px] mt-2 text-slate-600 group-hover:text-emerald-600 font-bold">{cat}</p>
            </div>
          ))}
        </div>

        {/* Produk Section */}
        <div className="bg-white mt-6 rounded-lg shadow-sm overflow-hidden">
           <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <h2 className="text-emerald-600 font-black text-lg md:text-xl italic tracking-tighter uppercase">
                  🔥 Rekomendasi Hari Ini
                </h2>
              </div>
           </div>
           
           {products.length === 0 ? (
             <div className="p-10 text-center text-slate-500">Belum ada produk. Tambahkan produk melalui Dashboard Admin.</div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0">
                {products.map((product: Product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id.toString()} // Prisma ID adalah Int, kita ubah ke String untuk Context
                    name={product.name}
                    price={product.price}
                    stock={product.stock}
                    category={product.category}
                    image={product.image || "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=300&h=300&fit=crop"}
                  />
                ))}
             </div>
           )}
        </div>
      </div>
    </main>
  );
}