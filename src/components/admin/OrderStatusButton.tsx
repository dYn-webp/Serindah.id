// src/components/admin/OrderStatusButton.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OrderStatusButton({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Logika urutan status
  const nextStatus = 
    currentStatus === "PENDING" ? "PAID" : 
    currentStatus === "PAID" ? "SHIPPED" : 
    currentStatus === "SHIPPED" ? "COMPLETED" : null;

  const buttonText = 
    currentStatus === "PENDING" ? "Tandai Dibayar" : 
    currentStatus === "PAID" ? "Kirim Barang" : 
    currentStatus === "SHIPPED" ? "Selesaikan" : "";

  const handleUpdate = async () => {
    if (!nextStatus) return;
    
    setIsLoading(true);
    const toastId = toast.loading("Memperbarui...");

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        toast.success("Status berhasil diubah!", { id: toastId });
        router.refresh(); // Otomatis me-refresh tabel agar statusnya berubah
      } else {
        throw new Error("Gagal");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStatus === "COMPLETED") {
    return <span className="text-xs font-bold text-slate-400 flex items-center gap-1">✅ Tuntas</span>;
  }

  return (
    <button 
      onClick={handleUpdate}
      disabled={isLoading}
      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition disabled:bg-slate-400"
    >
      {isLoading ? "..." : buttonText}
    </button>
  );
}