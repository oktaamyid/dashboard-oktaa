"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences, getProjects, getLinks } from "@/lib/firestore";
import { Experience, Project, Link, TableData } from "@/app/types";
import Card from '@/components/ui/card';

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
          Links: ["originalUrl", "createdAt"],
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

               <div className="mt-6">
                    {/* 🔹 Dropdown Select Table */}
                    <div className="mt-6 flex items-center gap-4">
                         <label htmlFor="table-select" className="text-gray-300 text-sm font-semibold">
                              Pilih Tabel:
                         </label>
                         <select
                              id="table-select"
                              value={selectedTable}
                              onChange={(e) => setSelectedTable(e.target.value as "Projects" | "Links" | "Experiences")}
                              className="bg-gray-700 text-gray-300 p-2 rounded-lg border border-gray-500 shadow-md focus:ring-2 focus:ring-gray-400 transition-all duration-300"
                         >
                              <option value="Projects">Projects</option>
                              <option value="Links">Links</option>
                              <option value="Experiences">Experiences</option>
                         </select>
                    </div>


                    {/* 🔹 Show data by selected table */}
                    {loading ? (
                         <p className="mt-4">Loading...</p>
                    ) : tableData.length > 0 ? (
                         <Table data={tableData} columns={columns} />
                    ) : (
                         <p className="mt-4">No data available.</p>
                    )}
               </div>
          </div>
     );
}
