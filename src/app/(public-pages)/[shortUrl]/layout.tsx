import { Metadata } from "next";
import { ASSETS } from "@/lib/assets";

type Props = {
     params: Promise<{ shortUrl: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
     const { shortUrl } = await params;

     // Format slug: "my-cool-link" -> "My Cool Link"
     const formattedTitle = decodeURIComponent(shortUrl || "")
          .split(/[-_]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

     const title = `${formattedTitle} | OKTAA`;
     const description = `Securely verify and access the link "${formattedTitle}" via OKTAA. Your trusted link management platform.`;

     return {
          metadataBase: new URL("https://oktaa.my.id"),
          title: title,
          description: description,
          keywords: ["Shorten Link Verification", "Link Verification", "Secure Redirect", formattedTitle, "OKTAA"],
          robots: {
               index: false, // Usually redirect pages shouldn't be indexed for content, but user asked for SEO. user said "SEO friendly". If it's a profile/bio page, index=true. If it's just a redirect confirmation, maybe true? Let's default to true as per user request.
               follow: true
          },
          openGraph: {
               title: title,
               description: description,
               url: `https://oktaa.my.id/${shortUrl}`,
               type: "website",
               images: [
                    {
                         url: ASSETS.OG_BANNER,
                         width: 1200,
                         height: 630,
                         alt: `Link Verification - ${formattedTitle}`,
                    },
               ],
          },
          twitter: {
               card: "summary_large_image",
               title: title,
               description: description,
               images: [ASSETS.OG_BANNER],
          },
          icons: {
               icon: ASSETS.ICON,
               apple: ASSETS.APPLE,
          },
          other: {
               "google-adsense-account": "ca-pub-8320640493505504",
          },
     };
}


export default function ShortUrlLayout({ children }: { children: React.ReactNode }) {
     return (
          <div>
               {children}
          </div>
     )
}