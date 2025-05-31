import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
     console.log("⚡ Middleware berjalan di:", req.nextUrl.pathname);

     const token = req.cookies.get("token")?.value;
     const pathname = req.nextUrl.pathname;

     // Daftar rute yang termasuk dalam grup (dashboard) dan memerlukan autentikasi
     const protectedRoutes = [
          "/",
          "/experiences",
          "/links",
          "/projects",
          "/subdomains",
          "/profile"
     ];

     // Pengecualian untuk rute publik
     const isShortUrl = pathname.split("/").length === 2 && pathname !== "/login" && pathname !== "/"; // Untuk short URL seperti /awa

     // Jika rute adalah short URL, biarkan diakses tanpa autentikasi
     if (isShortUrl) {
          console.log("🔗 Mengakses short URL:", pathname);
          return NextResponse.next();
     }

     // Jika rute termasuk dalam protectedRoutes dan tidak ada token
     if (protectedRoutes.includes(pathname) && !token) {
          console.log("⛔ Tidak ada token, redirect ke /login");
          return NextResponse.redirect(new URL("/login", req.url));
     }

     // Jika sudah login dan mencoba mengakses /login, redirect ke / (halaman utama di dalam dashboard)
     if (token && pathname === "/login") {
          console.log("✅ Sudah login, redirect ke /");
          return NextResponse.redirect(new URL("/", req.url));
     }

     // Jika tidak ada masalah, lanjutkan
     return NextResponse.next();
}

// Matcher untuk semua rute yang relevan
export const config = {
     matcher: [
          "/",
          "/experiences/:path*",
          "/links/:path*",
          "/projects/:path*",
          "/subdomains/:path*",
          "/profile/:path*",
          "/login",
          "/:path" // Untuk menangani short URL seperti /awa
     ],
};