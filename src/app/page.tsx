// src/app/page.tsx
import Navbar from "@/components/shared/Navbar";
import { ProductCard } from "@/components/customer/ProductCard";
import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  // Mengambil data banner (Pastikan model Banner sudah ada di schema.prisma)
  const bannersData = await prisma.banner.findMany({
    where: { isActive: true }
  }).catch(() => []); // Fallback array kosong jika tabel belum di-migrate

  const banners: Record<string, any> = {};
  bannersData.forEach((b) => { banners[b.position] = b; });

  return (
    // Latar belakang putih es (sangat bersih)
    <main className="min-h-screen bg-[#F4F9FD] pb-20 text-slate-800 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* ================= HERO BANNER (DINGIN & HIGIENIS) ================= */}
        <div className="flex flex-col md:flex-row gap-5">
          
          {/* MAIN BANNER - Biru Laut (blue-600) */}
          <div className="relative w-full md:w-2/3 min-h-[260px] md:min-h-[400px] bg-blue-600 rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-blue-200 flex">
             <img 
                src={banners["MAIN"]?.imageUrl || "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&h=400&fit=crop"} 
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-overlay group-hover:scale-105 transition-all duration-700" 
                alt="Main Banner" 
             />
             
             {/* Gradien biru dingin ke transparan */}
             <div className="relative z-10 w-full h-full flex flex-col justify-center p-8 md:p-14 bg-gradient-to-r from-blue-900/80 via-blue-600/50 to-transparent">
                {banners["MAIN"]?.subtitle && (
                  <span className="bg-cyan-100 text-cyan-800 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-2xl w-fit mb-4 uppercase tracking-wider shadow-sm">
                    {banners["MAIN"].subtitle}
                  </span>
                )}
                <h2 className="text-white text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight max-w-lg drop-shadow-md">
                  {banners["MAIN"]?.title || "Kesegaran Kualitas Super Langsung dari Cold Storage"}
                </h2>
                <button className="bg-white text-blue-700 text-xs md:text-sm font-bold px-8 py-3.5 rounded-2xl w-fit hover:bg-cyan-50 transition-colors shadow-sm mt-2">
                  Lihat Katalog
                </button>
             </div>
          </div>

          {/* SUB BANNERS - Biru Es Terang (sky-50) */}
          <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-5">
            
            {/* SUB 1 */}
            <div className="relative flex-1 min-h-[140px] md:min-h-[190px] bg-sky-100 rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-sky-200">
               <img src={banners["SUB_1"]?.imageUrl || "https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=400&h=200&fit=crop"} className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 group-hover:scale-105 transition duration-700" alt="Daging Sapi Beku" />
               <div className="relative z-10 w-full h-full flex flex-col justify-end p-6 bg-gradient-to-t from-white/95 via-white/60 to-transparent">
                  <h3 className="text-blue-950 font-extrabold text-base md:text-xl leading-tight">{banners["SUB_1"]?.title || "Daging Sapi Segar"}</h3>
                  <p className="text-blue-600 text-[11px] md:text-xs font-semibold mt-1">{banners["SUB_1"]?.subtitle || "Potongan Premium Beku"}</p>
               </div>
            </div>
            
            {/* SUB 2 */}
            <div className="relative flex-1 min-h-[140px] md:min-h-[190px] bg-sky-100 rounded-2xl overflow-hidden group cursor-pointer shadow-sm border border-sky-200">
               <img src={banners["SUB_2"]?.imageUrl || "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400&h=200&fit=crop"} className="absolute inset-0 w-full h-full object-cover z-0 opacity-50 group-hover:scale-105 transition duration-700" alt="Seafood Beku" />
               <div className="relative z-10 w-full h-full flex flex-col justify-end p-6 bg-gradient-to-t from-white/95 via-white/60 to-transparent">
                  <h3 className="text-blue-950 font-extrabold text-base md:text-xl leading-tight">{banners["SUB_2"]?.title || "Seafood Tangkapan Laut"}</h3>
                  <p className="text-blue-600 text-[11px] md:text-xs font-semibold mt-1">{banners["SUB_2"]?.subtitle || "Dibekukan di Kapal (FAS)"}</p>
               </div>
            </div>

          </div>
        </div>

        {/* ================= CATEGORY FILTER ================= */}
        <div className="mt-8 mb-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['Semua Produk', 'Daging Sapi', 'Seafood', 'Unggas', 'Sayuran Beku'].map((cat, idx) => (
            <button key={cat} className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all border ${
              idx === 0 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 hover:text-blue-600'
            }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* ================= PRODUCT SECTION ================= */}
        <div className="mt-8 mb-6">
          <h2 className="text-slate-900 font-black text-xl md:text-2xl tracking-tight">
            Produk <span className="text-cyan-600">Terbaru</span>
          </h2>
        </div>
           
        {/* Render Produk Menggunakan Grid Baru */}
        {products.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100">
            Belum ada produk. Tambahkan produk melalui Dashboard Admin.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product: Product) => (
              <ProductCard 
                key={product.id}
                id={product.id.toString()}
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
    </main>
  );
}