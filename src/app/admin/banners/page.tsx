// src/app/admin/banners/page.tsx
"use client";
import AdminSidebar from "@/components/admin/Sidebar";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Image as ImageIcon, Save } from "lucide-react";

// Tiga posisi banner yang ada di desain kita
const POSITIONS = [
  { id: "MAIN", label: "Banner Utama (Besar Kiri)" },
  { id: "SUB_1", label: "Banner Kecil (Kanan Atas)" },
  { id: "SUB_2", label: "Banner Kecil (Kanan Bawah)" },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data saat halaman dimuat
  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        const bannerMap: Record<string, any> = {};
        data.forEach((b: any) => { bannerMap[b.position] = b; });
        setBanners(bannerMap);
      });
  }, []);

  const handleChange = (position: string, field: string, value: string) => {
    setBanners((prev) => ({
      ...prev,
      [position]: { ...prev[position], [field]: value, position }
    }));
  };

  const handleSave = async (position: string) => {
    const bannerData = banners[position];
    if (!bannerData?.imageUrl) return toast.error("Link gambar wajib diisi!");

    setIsLoading(true);
    const toastId = toast.loading(`Menyimpan ${position}...`);

    try {
      const res = await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerData),
      });

      if (res.ok) toast.success("Banner diperbarui!", { id: toastId });
      else throw new Error("Gagal");
    } catch (error) {
      toast.error("Terjadi kesalahan", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <ImageIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Tampilan (Banner)</h1>
            <p className="text-slate-500 text-sm">Ubah gambar promosi dan teks yang muncul di Beranda pelanggan.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSITIONS.map((pos) => (
            <div key={pos.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h2 className="font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                {pos.label}
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-black">{pos.id}</span>
              </h2>

              <div className="space-y-4 flex-1">
                {/* Preview Gambar Mini */}
                <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  {banners[pos.id]?.imageUrl ? (
                    <img src={banners[pos.id].imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Belum ada gambar</div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Link Gambar (URL)</label>
                  <input type="text" placeholder="https://..." value={banners[pos.id]?.imageUrl || ""} onChange={(e) => handleChange(pos.id, "imageUrl", e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Judul Promo <span className="text-[10px] font-normal lowercase">(Opsional)</span></label>
                  <input type="text" placeholder="Cth: Pesta Bakso" value={banners[pos.id]?.title || ""} onChange={(e) => handleChange(pos.id, "title", e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Sub-Judul / Diskon <span className="text-[10px] font-normal lowercase">(Opsional)</span></label>
                  <input type="text" placeholder="Cth: Diskon 50%" value={banners[pos.id]?.subtitle || ""} onChange={(e) => handleChange(pos.id, "subtitle", e.target.value)} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 text-sm" />
                </div>
              </div>

              <button onClick={() => handleSave(pos.id)} disabled={isLoading} className="mt-6 w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2">
                <Save size={16} /> Simpan Banner
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}