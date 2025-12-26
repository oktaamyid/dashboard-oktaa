import { Raleway } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';
import { ToastProvider } from "@/components/ui/toast";
import { ASSETS } from "@/lib/assets";

const raleway = Raleway({
     subsets: ['latin'],
     weight: ['400', '700'],
     variable: '--font-raleway',
});

export const metadata: Metadata = {
     title: "oktaamyid~ | Dashboard",
     metadataBase: new URL("https://oktaa.my.id"),
     description: "oktaamyid~ lets you unleash your digital identity with a sleek platform to manage content, projects, and more. Crafted by Firtiansyah Okta Resama for creators and innovators.",
     icons: {
          icon: ASSETS.ICON,
          apple: ASSETS.APPLE
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
          title: "oktaamyid~ | Dashboard",
          description: "oktaamyid~ lets you unleash your digital identity with a sleek platform to manage content, projects, and more. Crafted by Firtiansyah Okta Resama for creators and innovators.",
          images: [
               {
                    url: ASSETS.OG_BANNER,
                    width: 1200,
                    height: 630,
                    alt: "oktaamyid~ Logo",
               },
          ],
     },
     twitter: {
          card: "summary_large_image",
          site: "@oktaa",
          title: "oktaamyid~ | Dashboard",
          description: "oktaamyid~ lets you unleash your digital identity with a sleek platform to manage content, projects, and more. Crafted by Firtiansyah Okta Resama for creators and innovators.",
          images: [ASSETS.OG_BANNER],
     },
     other: {
          "google-adsense-account": "ca-pub-8320640493505504",
     }
};

export default function Layout({ children }: { children: React.ReactNode }) {
     return (
          <html lang="en">
               <body className={raleway.variable}>
                    <ToastProvider>
                         {children}
                    </ToastProvider>
               </body>
          </html>
     );
}