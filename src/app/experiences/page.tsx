// app/experiences/page.tsx
"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences } from "@/lib/firestore";
import { Experience } from "@/app/types";

export default function Experiences() {
     const [data, setData] = useState<Experience[]>([]);

     useEffect(() => {
          const fetchData = async () => {
               const experiences = await getExperiences();
               setData(experiences);
          };

          fetchData();
     }, []);

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Experiences</h1>
               <Table
                    data={data}
                    columns={["id", "company", "role", "year", "techStack"]}
               />
          </div>
     );
}