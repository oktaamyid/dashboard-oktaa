"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ASSETS } from "@/lib/assets";

export default function ShortUrlPage(props: { params: Promise<{ shortUrl?: string }> }) {
     const params = use(props.params);
     const router = useRouter();
     const [originalUrl, setOriginalUrl] = useState<string | null>(null);
     const [showConfirmationPage, setShowConfirmationPage] = useState<boolean>(false);
     const [customMessage, setCustomMessage] = useState<string | null>(null);
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<boolean>(false);

     useEffect(() => {
          try {
               (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (error) {
               console.error("Adsense script error: ", error);
          }

          if (!params?.shortUrl) {
               router.replace('/404');
               return;
          }

          const fetchOriginalUrl = async () => {
               try {
                    const res = await fetch(`/api/links/${encodeURIComponent(params.shortUrl || "")}`);
                    if (!res.ok) {
                         setError(true);
                         window.location.replace('/404');
                         return;
                    }

                    const data = await res.json();

                    if (!data.showConfirmationPage) {
                         window.location.replace(data.originalUrl);
                         return;
                    }

                    setOriginalUrl(data.originalUrl);
                    setShowConfirmationPage(data.showConfirmationPage ?? false);
                    setCustomMessage(data.confirmationPageSettings?.customMessage);
               } catch (error) {
                    console.error("❌ Fetch error:", error);
                    setError(true);
                    window.location.replace('/404');
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
          return (
               <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

                    <div className="flex flex-col sm:flex-row items-center mb-10 gap-6 relative z-10">
                         <Skeleton circle width={80} height={80} baseColor="#27272a" highlightColor="#3f3f46" />
                    </div>

                    <div className="bg-black border border-white/10 p-8 w-full max-w-[90%] sm:max-w-md relative z-10">
                         <div className="text-center space-y-4">
                              <Skeleton width={120} height={16} baseColor="#27272a" highlightColor="#3f3f46" containerClassName="mx-auto" />
                              <Skeleton width="90%" height={24} baseColor="#27272a" highlightColor="#3f3f46" containerClassName="mx-auto" />
                         </div>
                         <div className="mt-8">
                              <Skeleton width="100%" height={48} baseColor="#27272a" highlightColor="#3f3f46" />
                         </div>
                    </div>
               </div>
          );
     }

     if (error) {
          return null; // or redirecting...
     }

     return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 relative overflow-hidden font-sans">
               {/* Background Decoration */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

               <div className="w-full max-w-md z-10 flex flex-col items-center">
                    {/* Brand Icon */}
                    <div className="mb-10 w-24 h-24 bg-black flex items-center justify-center">
                         <Image
                              src={ASSETS.LOGO_LIGHT}
                              alt="Brand Logo"
                              width={40}
                              height={40}
                              className="object-contain"
                         />
                    </div>

                    {/* Content Card */}
                    <div className="bg-black border border-white/10 p-8 w-full backdrop-blur-sm">
                         <div className="text-center space-y-2 mb-8">
                              <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-bold">Secure Link Verification</p>
                              <p className="text-white font-black text-2xl tracking-tight break-all">
                                   oktaa.my.id/<span className="text-zinc-400">{params.shortUrl}</span>
                              </p>
                         </div>

                         {/* Custom Message */}
                         {customMessage && (
                              <div className="mb-8 p-6 bg-zinc-900/50 border border-white/5 text-center">
                                   <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3 font-bold">Message from creator</p>
                                   <p className="text-zinc-300 text-base italic font-serif">"{customMessage}"</p>
                              </div>
                         )}

                         <div className="space-y-6">
                              <div>
                                   <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Destination URL</label>
                                   <div className="relative group">
                                        <input
                                             type="text"
                                             value={originalUrl || ""}
                                             readOnly
                                             className="block w-full bg-black border border-white/20 text-white text-base p-4 focus:outline-none focus:border-white transition-colors text-center font-mono placeholder-zinc-700"
                                        />
                                   </div>
                              </div>

                              <div className="pt-2">
                                   <p className="text-xs text-zinc-600 text-center leading-relaxed">
                                        By clicking 'Continue', you acknowledge that you will be redirected to an external website.
                                   </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-8">
                                   <button
                                        onClick={handleBack}
                                        className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] bg-transparent border border-white/20 text-white hover:bg-white/5 transition-all duration-300"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={handleContinue}
                                        className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] bg-white text-black border border-white hover:bg-zinc-200 transition-all duration-300"
                                   >
                                        Continue
                                   </button>
                              </div>
                         </div>
                    </div>

                    {/* Ads Section */}
                    <div className="mt-8 w-full">
                         <p className="text-xs text-zinc-700 text-center uppercase tracking-widest mb-4">Sponsored</p>
                         <div className="w-full flex items-center justify-center min-h-25 border border-white/5 bg-zinc-900/20">
                              <ins className="adsbygoogle"
                                   style={{ display: "block" }}
                                   data-ad-client="ca-pub-8320640493505504"
                                   data-ad-slot="9039091075"
                                   data-ad-format="auto"
                                   data-full-width-responsive="true"></ins>
                         </div>
                    </div>
               </div>
          </div>
     );
}