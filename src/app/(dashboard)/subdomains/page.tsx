// app/subdomains/page.tsx
"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getSubdomains } from "@/lib/service";
import { Subdomain } from "@/app/types";

export default function SubdomainsPage() {
     const [data, setData] = useState<Subdomain[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function fetchData() {
               try {
                    setLoading(true);
                    const subdomains = await getSubdomains();
                    setData(subdomains);

               } catch (error) {
                    console.error("Error fetching subdomains:", error);
               } finally {
                    setLoading(false);
               }
          }

          fetchData();
     }, []);

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Subdomains</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Manage Domain Routing</p>
                    </div>
               </div>

               <div className="border border-white/10 rounded-none overflow-hidden">
                    <Table
                         data={data}
                         columns={["name", "type", "content"]}
                         isLoading={loading}
                         renderCell={(column, row) => row[column as keyof Subdomain]}
                    />
               </div>
          </div>
     );
}
