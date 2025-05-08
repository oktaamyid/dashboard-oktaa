// lib/service/subdomains/subdomain.ts
export async function getSubdomains(): Promise<{ id: string; name: string; type: string; content: string }[]> {
     const res = await fetch("/api/subdomains", { cache: "no-store" });

     if (!res.ok) throw new Error("Failed to fetch subdomains");

     return res.json();
}
