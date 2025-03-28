import { Raleway } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';

const raleway = Raleway({
     subsets: ['latin'],
     weight: ['400', '700'],
     variable: '--font-raleway',
});

export const metadata: Metadata = {
     metadataBase: new URL("https://oktaa.my.id"),
     title: "Hawlo - Oktaa.",
     icons: "https://oktaa.my.id/oktaa-white.svg",
     authors: [{ name: "Firtiansyah Okta Resama", url: "https://firtiansyah.oktaa.my.id" }],
     description: "Oktaa is a personal brand and domain name owned by okta, representing his identity and projects.",
     other: {
          "google-adsense-account": "ca-pub-8320640493505504",
          "monetag": "4295e4a45e975c12564f05a2fa041ea0",
     }
};

export default function Layout({children}: { children: React.ReactNode }) {
     return (
          <html lang="en">
               <body className={raleway.variable}>
                    {children}
               </body>
          </html>
     )
}