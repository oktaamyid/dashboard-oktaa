"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences, getProjects, getLinks } from "@/lib/firestore";
import { Experience, Project, Link, TableData } from "@/app/types";
import Card from '@/components/ui/card';
import Select from '@/components/ui/select';

export default function Overview() {
     const [selectedTable, setSelectedTable] = useState<"Projects" | "Links" | "Experiences">("Projects");
     const [projects, setProjects] = useState<Project[]>([]);
     const [links, setLinks] = useState<Link[]>([]);
     const [experiences, setExperiences] = useState<Experience[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchData = async () => {
               setLoading(true);
               try {
                    const [projectsData, linksData, experiencesData] = await Promise.all([
                         getProjects(),
                         getLinks(),
                         getExperiences(),
                    ]);
                    setProjects(projectsData);
                    setLinks(linksData);
                    setExperiences(experiencesData);
               } catch (error) {
                    console.error("Error fetching data: ", error);
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     const tableData: TableData[] =
          selectedTable === "Projects" ? projects : selectedTable === "Links" ? links : experiences;

     const columnsToShow: Record<"Projects" | "Links" | "Experiences", string[]> = {
          Projects: ["title", "description", "technology"],
          Links: ["originalUrl", "shortUrl", "createdAt", "updatedAt"],
          Experiences: ["company", "role", "year"],
     };

     const columns = columnsToShow[selectedTable];

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Overview</h1>

               {/* 🔹 Card showing total length for all data Project, Experience, Link */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card title="Total Projects" value={projects.length.toString()} />
                    <Card title="Total Links" value={links.length.toString()} />
                    <Card title="Total Experiences" value={experiences.length.toString()} />
               </div>

               <div className="mt-6 space-y-4">
                    {/* 🔹 Dropdown Select Table */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                         <Select
                              label="Choose Table:"
                              options={[
                                   { label: "Projects", value: "Projects" },
                                   { label: "Links", value: "Links" },
                                   { label: "Experiences", value: "Experiences" },
                              ]}
                              value={selectedTable}
                              onChange={(e) => setSelectedTable(e.target.value as "Projects" | "Links" | "Experiences")}
                              className="w-full sm:w-48"
                         />
                         {/* Opsional: Tambahkan tombol atau aksi tambahan di sini */}
                    </div>

                    {/* 🔹 Show data by selected table */}
                    <div className="w-full overflow-hidden rounded-lg shadow-md">
                         <Table
                              data={tableData}
                              columns={columns}
                              isLoading={loading}
                         />
                    </div>
               </div>
          </div>
     );
}
