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
          <div>
               <h1 className="text-2xl font-bold mb-6">Subdomains</h1>
               <Table
                    data={data}
                    columns={["name", "type", "content"]}
                    isLoading={loading}
                    renderCell={(column, row) => row[column as keyof Subdomain]}
               />
          </div>
     );
}
