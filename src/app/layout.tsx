import { Raleway } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';

const raleway = Raleway({
     subsets: ['latin'],
     weight: ['400', '700'],
     variable: '--font-raleway',
});

export const metadata: Metadata = {
     metadataBase: new URL("https://firtiansyah.my.id"),
     title: "Oktaa.", // <- Seharusnya ini mengubah title
     icons: "/oktaa-white.svg",
     authors: [{ name: "Firtiansyah Okta Resama", url: "https://firtiansyah.my.id" }],
     description: "Oktaa is the domain name from Firtiansyah Okta, and then use the Okta for brand identity name.",
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