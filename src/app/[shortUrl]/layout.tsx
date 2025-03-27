import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Confirm Link Access",
     description: "Confirmation link accees page.",
     other: {
          "google-adsense-account": "ca-pub-8320640493505504",
     }
};

export default function ShortUrlLayout({ children }: { children: React.ReactNode }) {
     return <>{children}</>;
}