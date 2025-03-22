"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function ShortUrlPage(props: { params: Promise<{ shortUrl?: string }> }) {
     const params = use(props.params);
     const router = useRouter();
     const [originalUrl, setOriginalUrl] = useState<string | null>(null);
     const [requireConfirmationPage, setRequireConfirmationPage] = useState<boolean>(false);
     const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
     const [loading, setLoading] = useState<boolean>(true);

     useEffect(() => {
          if (!params?.shortUrl) return;

          const fetchOriginalUrl = async () => {
               try {
                    const res = await fetch(`/api/links/${encodeURIComponent(params.shortUrl || "")}`);
                    if (!res.ok) {
                         router.push("/404");
                         return;
                    }

                    const data = await res.json();
                    setOriginalUrl(data.originalUrl);
                    setRequireConfirmationPage(data.requireConfirmationPage ?? false);
                    setShowConfirmation(data.showConfirmationPage ?? false);

                    // 🔹 Jika requireConfirmationPage = false, langsung redirect ke originalUrl
                    if (!data.requireConfirmationPage) {
                         window.location.href = data.originalUrl;
                         return;
                    }
               } catch (error) {
                    console.error("Fetch error:", error);
                    router.push("/404");
               } finally {
                    setLoading(false);
               }
          };

          fetchOriginalUrl();
     }, [params?.shortUrl, router]);

     const handleBack = () => router.back();
     const handleContinue = () => {
          if (originalUrl) window.location.href = originalUrl;
     };

     if (loading) {
          return <p className="text-center text-gray-500">Loading...</p>;
     }

     return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
               {/* Header */}
               <div className="flex flex-col items-center mb-6">
                    <h1 className="text-xl font-semibold mt-2">Confirm Link Access</h1>
               </div>

               {/* URL Form */}
               <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700">Original URL:</label>
                    <input
                         type="text"
                         value={originalUrl || ""}
                         readOnly
                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-gray-700"
                    />

                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                         <button
                              onClick={handleBack}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                         >
                              Back
                         </button>
                         <button
                              onClick={handleContinue}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                         >
                              Continue
                         </button>
                    </div>
               </div>

               {/* Ads Section (Placeholder) */}
               <div className="mt-6 w-full max-w-md">
                    <p className="text-sm text-gray-500 text-center">Advertisement</p>
                    <div className="w-full h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                         <span className="text-gray-600">Ad Space</span>
                    </div>
               </div>
          </div>
     );
}
