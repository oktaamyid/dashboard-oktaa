// app/experiences/page.tsx
"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences } from "@/lib/service";
import { Experience } from "@/app/types";
import { formatArrayCell } from "@/lib/utils/formatArray";

export default function Experiences() {
     const [data, setData] = useState<Experience[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function fetchData() {
               try {
                    setLoading(true);
                    const experiences = await getExperiences();
                    setData(experiences);
               } catch (error) {
                    console.error("Error fetching data: ", error);
               } finally {
                    setLoading(false);
               }
          }

          fetchData();
     }, []);

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Experiences</h1>
               <Table
                    data={data}
                    columns={["id", "company", "role", "year", "techStack"]}
                    isLoading={loading}
                    renderCell={(column, row) => {
                         if (column == "techStack") return formatArrayCell(row[column]);
                         return row[column as keyof Experience] as React.ReactNode;
                    }}
               />
          </div>
     );
}