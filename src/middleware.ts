import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
     console.log("⚡ Middleware berjalan di:", req.nextUrl.pathname);

     const token = req.cookies.get("token")?.value;

     // Pengecualian: Jika halaman adalah "/login" atau halaman short URL ("/slug")
     const isPublicPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.split("/").length === 2;

     if (!token && !isPublicPage) {
          console.log("⛔ Tidak ada token, redirect ke /login");
          return NextResponse.redirect(new URL("/login", req.url));
     }

     if (token && req.nextUrl.pathname === "/login") {
          console.log("✅ Sudah login, redirect ke /dashboard");
          return NextResponse.redirect(new URL("/dashboard", req.url));
     }

     return NextResponse.next();
}

// Middleware hanya berjalan untuk halaman dashboard dan semua subhalaman lainnya (kecuali short URL dan login)
export const config = {
     matcher: ["/dashboard/:path*", "/experiences/:path*", "/projects/:path*", "/links/:path*"],
};