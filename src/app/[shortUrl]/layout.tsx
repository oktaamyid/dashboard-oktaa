import { Metadata } from "next";

export async function generateMetada(): Promise<Metadata>  {
     return {
          title: "Confirm Link Access",
          description: "Confirmation link accees page."
     }
}

export default function ShortUrlLayout({ children }: { children: React.ReactNode }) {
     return <>{children}</>;
}