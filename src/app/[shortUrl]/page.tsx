"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Image from 'next/image';
import Head from 'next/head';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
               <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
                    <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                         {/* Brand Header Skeleton */}
                         <div className="flex items-center gap-4 mb-6">
                              <Skeleton circle width={50} height={50} />
                              <Skeleton width={200} height={24} />
                         </div>

                         {/* URL Box Skeleton */}
                         <div className="space-y-4">
                              <Skeleton width={120} height={16} />
                              <Skeleton width="100%" height={24} />

                              {/* Custom Message Skeleton (conditional) */}
                              <div className="space-y-2">
                                   <Skeleton width={180} height={16} />
                                   <Skeleton width="100%" height={48} />
                              </div>

                              <Skeleton width={220} height={16} />
                              <Skeleton width="100%" height={40} />

                              {/* Buttons Skeleton */}
                              <div className="flex gap-4 pt-2">
                                   <Skeleton width="50%" height={40} />
                                   <Skeleton width="50%" height={40} />
                              </div>
                         </div>

                         {/* Ad Section Skeleton */}
                         <div className="mt-6 space-y-2">
                              <Skeleton width={100} height={16} containerClassName="mx-auto" />
                              <Skeleton width="100%" height={96} />
                         </div>
                    </div>
               </div>
          );
     }

     if (error) {
          return console.log(error);
     }

     if (showConfirmationPage) {
          console.log("success");
     }

     return (
          <>
               <Head>
                    <script
                         async
                         src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8320640493505504"
                         crossOrigin="anonymous"
                    />
               </Head>

               <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
                    {/* Brand Icon & Header */}
                    <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 text-center sm:text-left">
                         <Image
                              src="/oktaa-black.svg"
                              alt="Brand Logo"
                              width={50}
                              height={50}
                              className="rounded-full"
                         />
                         <h1 className="text-gray-800 text-lg sm:text-xl font-semibold">Confirm Link Access</h1>
                    </div>

                    {/* URL Box */}
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-[90%] sm:max-w-md text-center">
                         <p className="text-gray-500 text-sm">Short URL accessed:</p>
                         <p className="text-blue-600 font-medium text-lg break-words">{window.location.origin}/{params.shortUrl}</p>

                         {/* Custom Message Display */}
                         {customMessage && (
                              <div className="mt-4 bg-gray-200 p-3 rounded-lg text-gray-700 text-sm sm:text-base">
                                   <p className="font-medium">Message from the creator:</p>
                                   <p className="italic">{customMessage}</p>
                              </div>
                         )}

                         <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700">You will be redirected to:</label>
                              <input
                                   type="text"
                                   value={originalUrl || ""}
                                   readOnly
                                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-gray-700 text-center text-sm sm:text-base"
                              />
                         </div>

                         {/* Buttons */}
                         <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2 sm:gap-4">
                              <button
                                   onClick={handleBack}
                                   className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                              >
                                   Back
                              </button>
                              <button
                                   onClick={handleContinue}
                                   className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                              >
                                   Continue
                              </button>
                         </div>
                    </div>

                    {/* Ads Section */}
                    <div className="mt-6 w-full max-w-[90%] sm:max-w-md">
                         <p className="text-sm text-gray-500 text-center">Advertisement</p>
                         <div className="w-full h-24 flex items-center justify-center">
                              <ins className="adsbygoogle"
                                   style={{ display: "block" }}
                                   data-ad-client="ca-pub-8320640493505504"
                                   data-ad-slot="9039091075"
                                   data-ad-format="auto"
                                   data-full-width-responsive="true"></ins>
                         </div>
                    </div>
               </div>
          </>
     );
}