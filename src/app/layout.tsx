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
     title: "Hawlo - Oktaa. | Personal Brand and Domain Name",
     icons: {
          icon: "https://cdn.oktaa.my.id/favicon.ico",
          apple: "https://cdn.oktaa.my.id/apple-touch-icon.png"
     },
     authors: [{ name: "Firtiansyah Okta Resama", url: "https://firtiansyah.oktaa.my.id" }],
     description: "Oktaa is a personal brand and domain name owned by okta, representing his identity and projects.",
     keywords: [
          "Firtiansyah Okta Resama",
          "Web Developer",
          "Programmer",
          "Full-stack Engineer",
          "Indonesia",
          "Firtiansyah",
          "Oktaa",
          "Siapa Firtiansyah Okta Resama",
          "tian",
          "Firtiansyah adalah",
          "Firtiansyah Okta Portfolio Website",
          "Firtiansyah Website",
          "Firtiansyah Personal Brand",
          "Oktaa Brand"
     ],
     openGraph: {
          type: "website",
          url: "https://oktaa.my.id",
          title: "Hawlo - Oktaa. | Personal Brand and Domain Name",
          description: "Oktaa is a personal brand and domain name owned by okta, representing his identity and projects.",
          images: [
               {
                    url: "https://cdn.oktaa.my.id/banner.png",
                    width: 1200,
                    height: 630,
                    alt: "Oktaa Logo",
               },
          ],
     },
     twitter: {
          card: "summary_large_image",
          site: "@oktaa",
          title: "Hawlo - Oktaa. | Personal Brand and Domain Name",
          description: "Oktaa is a personal brand and domain name owned by okta, representing his identity and projects.",
          images: ["https://cdn.oktaa.my.id/banner.png"],
     },
     other: {
          "google-adsense-account": "ca-pub-8320640493505504",
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