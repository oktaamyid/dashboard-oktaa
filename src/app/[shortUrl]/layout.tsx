import { Metadata } from "next";

export const metadata: Metadata = {
     title: "Confirm Link Access",
     description: "Confirmation link accees page."
};

export default function ShortUrlLayout({ children }: { children: React.ReactNode }) {
     return <>{children}</>;
}