// app/projects/page.tsx
"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getProjects } from "@/lib/firestore";
import { Project } from "@/app/types";

export default function Projects() {
     const [data, setData] = useState<Project[]>([]);

     useEffect(() => {
          const fetchData = async () => {
               const projects = await getProjects();
               setData(projects);
          };

          fetchData();
     }, []);

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Projects</h1>
               <Table
                    data={data}
                    columns={["id", "title", "description", "technology"]}
               />
          </div>
     );
}