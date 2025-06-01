import { Metadata } from "next";

export const metadata: Metadata = {
     metadataBase: new URL("https://oktaa.my.id"),
     title: "Shorten Link Verification. | OKTAA~",
     description: "Verify your shorten link securely through Oktaa. Simplify and manage your links with ease.",
     keywords: ["Shorten Link Verification", "Firtiansyah Okta Website", "Firtiansyah Website", "Link Management", "Short Links", "Shorten OKTAA"],
     robots: {
          index: true,
          follow: true
     },
     openGraph: {
          title: "Shorten Link Verification. | OKTAA~",
          description: "Verify your shorten link securely through Oktaa. Simplify and manage your links with ease.",
          url: "https://oktaa.my.id",
          type: "website",
          images: [
               {
                    url: "https://cdn.oktaa.my.id/og-banner.png",
                    width: 1200,
                    height: 630,
                    alt: "Shorten Link Verification - Oktaa",
               },
          ],
     },
     twitter: {
          card: "summary_large_image",
          title: "Shorten Link Verification. | OKTAA~",
          description: "Verify your shorten link securely through Oktaa. Simplify and manage your links with ease.",
          images: ["https://cdn.oktaa.my.id/og-banner.png"],
     },
     icons: {
          icon: "https://cdn.oktaa.my.id/favicon.ico",
          apple: "https://cdn.oktaa.my.id/apple-touch-icon.png",
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