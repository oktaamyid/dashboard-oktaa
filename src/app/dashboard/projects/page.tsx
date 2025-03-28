// app/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getProjects } from "@/lib/firestore";
import { Project } from "@/app/types";

export default function Projects() {
     const [data, setData] = useState<Project[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function fetchData() {
               try {
                    setLoading(true);
                    const projects = await getProjects();
                    setData(projects);
               }
               catch (error) {
                    console.error("Error fetching data: ", error);
               }
               finally {
                    setLoading(false);
               }
          }

          fetchData();
     }, []);

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Projects</h1>
               <Table
                    data={data}
                    columns={["id", "title", "description", "technology"]}
                    isLoading={loading}
               />
          </div>
     );
}