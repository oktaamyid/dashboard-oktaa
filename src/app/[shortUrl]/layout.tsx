import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Shorten Link Verification - Oktaa.",
     description: "Verify your shorten link securely through Oktaa. Simplify and manage your links with ease.",
     keywords: ["Shorten Link Verification", "Oktaa Dashboard", "Secure Access", "Link Management", "Short Links"],
     robots: "index, follow",
     openGraph: {
          title: "Shorten Link Verification - Oktaa.",
          description: "Easily verify and manage your shorten links securely through Oktaa.",
          url: "https://oktaa.my.id",
          type: "website",
          images: [
               {
                    url: "https://oktaa.my.id/banner.png",
                    width: 1200,
                    height: 630,
                    alt: "Shorten Link Verification - Oktaa",
               },
          ],
     },
     twitter: {
          card: "summary_large_image",
          title: "Shorten Link Verification - Oktaa",
          description: "Easily verify and manage your shorten links securely through Oktaa.",
          images: ["https://oktaa.my.id/banner.png"],
     },
     icons: {
          icon: "https://oktaa.my.id/oktaa-black.png",
          apple: "https://oktaa.my.id/apple-touch-icon.png",
     },
     other: {
          "google-adsense-account": "ca-pub-8320640493505504",
     },
};


export default function ShortUrlLayout({ children }: { children: React.ReactNode }) {
     return (
          <div>
               {children} 
          </div>
     )
}