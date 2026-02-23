// src/proxy.ts
import { withAuth } from "next-auth/middleware"; // Import dari NextAuth biarkan saja seperti ini
import { NextResponse } from "next/server";

export default withAuth(
  // 👇 Ganti nama fungsi di sini menjadi proxy
  function proxy(req) {
    const token = req.nextauth.token;
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // Jika mencoba buka /admin tapi rolenya bukan ADMIN, tendang ke beranda
    if (isAdminPage && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = { matcher: ["/admin", "/admin/:path*", "/cart/checkout"] };