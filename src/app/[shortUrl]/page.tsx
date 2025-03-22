"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function ShortUrlPage(props: { params: Promise<{ shortUrl?: string }> }) {
     const params = use(props.params);
     const router = useRouter();
     const [originalUrl, setOriginalUrl] = useState<string | null>(null);
     const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

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
                    setShowConfirmation(data.showConfirmationPage ?? false);
               } catch (error) {
                    console.error("Fetch error:", error);
                    router.push("/404");
               }
          };

          fetchOriginalUrl();
     }, [params?.shortUrl, router]);

     if (!originalUrl) {
          return <p>Loading...</p>;
     }

     return (
          <div>
               {showConfirmation ? (
                    <p>Redirecting to {originalUrl}...</p>
               ) : (
                    <p>Shortened URL: {originalUrl}</p>
               )}
          </div>
     );
}
