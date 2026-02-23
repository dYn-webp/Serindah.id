import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast"; // 1. TAMBAHKAN INI

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frozemart - Frozen Food Premium",
  description: "Beli frozen food segar dan berkualitas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} overflow-x-hidden w-full`}>
        <Providers>
          <CartProvider>
            <Toaster position="top-center" reverseOrder={false} /> {/* 2. TAMBAHKAN INI */}
            {children}
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}