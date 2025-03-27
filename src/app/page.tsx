"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
     const router = useRouter();
     const [checkingAuth] = useState(true);

     useEffect(() => {
          const token = document.cookie.split("; ").find(row => row.startsWith("token="));

          if (token) {
               router.replace("/dashboard");
          } else {
               router.replace("/login");
          }
     }, [router]);

     if (checkingAuth) {
          return <div className="h-screen w-screen flex items-center justify-center">
               <p className="text-black text-lg">Loading...</p>
          </div>;
     }

     return null;
}
