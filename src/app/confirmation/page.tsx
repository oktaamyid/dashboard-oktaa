"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/button";

export default function ConfirmationPage() {
     const router = useRouter();
     const searchParams = useSearchParams();

     const originalUrl = searchParams.get("url");

     useEffect(() => {
          if (!originalUrl) {
               router.push("/");
          }
     }, [originalUrl, router]);

     return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
               {/* Header */}
               <div className="text-center mb-6">
                    <Image
                         src="/logo.png" // Ganti dengan logo asli
                         alt="Brand Logo"
                         width={80}
                         height={80}
                         className="mx-auto"
                    />
                    <h1 className="text-2xl font-bold mt-2 text-gray-800">
                         Confirm Link Access
                    </h1>
               </div>

               {/* URL Input */}
               <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                    <label className="block text-gray-600 text-sm font-semibold mb-2">
                         Destination URL:
                    </label>
                    <input
                         type="text"
                         value={originalUrl || ""}
                         readOnly
                         className="w-full px-4 py-2 border rounded-md text-gray-800 bg-gray-100 cursor-not-allowed"
                    />

                    {/* Actions */}
                    <div className="flex justify-between mt-4">
                         <Button variant="secondary" onClick={() => router.back()}>
                              Back
                         </Button>
                         <Button variant="primary" onClick={() => window.location.href = originalUrl!}>
                              Continue
                         </Button>
                    </div>
               </div>

               {/* Ads Section */}
               <div className="mt-6 p-4 bg-white rounded-lg shadow-md w-full max-w-lg text-center">
                    <p className="text-sm text-gray-500">Advertisement</p>
                    <div className="h-24 bg-gray-300 flex items-center justify-center">
                         <span className="text-gray-600">Your Ad Here</span>
                    </div>
               </div>
          </div>
     );
}
