// src/components/customer/Hero.tsx
export default function Hero() {
  return (
    <div className="bg-blue-50 py-12 px-4 rounded-3xl my-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center overflow-hidden">
      <div className="flex-1 space-y-4 text-center md:text-left">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          🔥 Stok Terbaru Minggu Ini
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
          Frozen Food Segar, <br /> 
          <span className="text-blue-600">Langsung ke Dapurmu.</span>
        </h1>
        <p className="text-gray-600 max-w-md">
          Hemat waktu masak dengan pilihan frozen food kualitas premium. Pengiriman instan untuk menjaga kualitas suhu.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition">
          Belanja Sekarang
        </button>
      </div>
      <div className="flex-1 mt-8 md:mt-0 flex justify-center">
        {/* Placeholder untuk gambar produk estetik */}
        <div className="w-64 h-64 bg-white rounded-2xl shadow-xl rotate-3 flex items-center justify-center p-4">
           <img src="/placeholder-frozen.png" alt="Produk Unggulan" className="rounded-lg object-contain" />
        </div>
      </div>
    </div>
  );
}