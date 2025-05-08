// app/api/subdomains/route.ts
import { NextResponse } from "next/server";
import { CloudflareResponse, DnsRecord } from '@/app/types';

export async function GET() {
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`, {
            headers: {
                  Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            },
            cache: "no-store",
      });

      const json = await res.json() as CloudflareResponse;

      if (!json.success) {
            return NextResponse.json({ success: false, message: "Failed to fetch DNS records" }, { status: 500 });
      }

      const filtered = json.result
            .filter((r): r is (typeof json.result[0] & { type: "A" | "CNAME" }) => 
                  r.type === "A" || r.type === "CNAME")
            .map((r): DnsRecord => ({
                  name: r.name,
                  type: r.type,
                  content: r.content,
            }));

      return NextResponse.json(filtered);
}
