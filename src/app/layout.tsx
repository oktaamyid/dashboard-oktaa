import { Raleway } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';

const raleway = Raleway({
     subsets: ['latin'],
     weight: ['400', '700'],
     variable: '--font-raleway',
});

export const metadata: Metadata = {
     title: "OKTAA~ | Unleash Your Digital Identity",
     metadataBase: new URL("https://oktaa.my.id"),
     description: "OKTAA~ lets you unleash your digital identity with a sleek platform to manage content, projects, and more. Crafted by Firtiansyah Okta Resama for creators and innovators.",
     icons: {
          icon: "https://cdn.oktaa.my.id/favicon.ico",
          apple: "https://cdn.oktaa.my.id/apple-touch-icon.png"
     },
     authors: [{ name: "Firtiansyah Okta Resama", url: "https://hi.oktaa.my.id" }],
     keywords: [
          "Firtiansyah Okta Resama",
          "Firtiansyah Okta Website",
          "Firtiansyah",
          "Siapa Firtiansyah Okta Resama",
          "Tian Website",
          "Firtiansyah adalah",
          "Firtiansyah Okta Portfolio Website",
          "Firtiansyah Website",
          "Firtiansyah Okta",
          "CMS Firtiansyah Okta",
     ],
     openGraph: {
          type: "website",
          url: "https://oktaa.my.id",
          title: "OKTAA~ | Unleash Your Digital Identity",
          description: "OKTAA~ lets you unleash your digital identity with a sleek platform to manage content, projects, and more. Crafted by Firtiansyah Okta Resama for creators and innovators.",
          images: [
               {
                    url: "https://cdn.oktaa.my.id/og-banner.png",
                    width: 1200,
                    height: 630,
                    alt: "OKTAA Logo",
               },
          ],
     },
     twitter: {
          card: "summary_large_image",
          site: "@oktaa",
          title: "OKTAA~ | Unleash Your Digital Identity",
          description: "OKTAA~ lets you unleash your digital identity with a sleek platform to manage content, projects, and more. Crafted by Firtiansyah Okta Resama for creators and innovators.",
          images: ["https://cdn.oktaa.my.id/og-banner.png"],
     },
     other: {
          "google-adsense-account": "ca-pub-8320640493505504",
     }
};

export default function Layout({ children }: { children: React.ReactNode }) {
     return (
          <html lang="en">
               <body className={raleway.variable}>
                    {children}
               </body>
          </html>
     );
}