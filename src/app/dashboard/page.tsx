"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences, getProjects, getLinks } from "@/lib/firestore";
import { Experience, Project, Link, TableData } from "@/app/types";
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { LinkIcon, FolderIcon, BriefcaseIcon } from '@heroicons/react/24/solid';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedStatsCard from '@/components/ui/animatedStatsCard';

export default function Overview() {
     const [selectedTable, setSelectedTable] = useState<"Projects" | "Links" | "Experiences">("Projects");
     const [projects, setProjects] = useState<Project[]>([]);
     const [links, setLinks] = useState<Link[]>([]);
     const [experiences, setExperiences] = useState<Experience[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");

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

     // Teknologi distribution untuk chart
     const technologyDistribution = projects.reduce((acc, project) => {
          const techs = Array.isArray(project.technology)
               ? project.technology.map(t => String(t).trim())
               : String(project.technology).split(',').map(t => t.trim());

          techs.forEach(tech => {
               acc[tech] = (acc[tech] || 0) + 1;
          });
          return acc;
     }, {} as Record<string, number>);

     const technologyChartData = Object.entries(technologyDistribution)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);  // Top 5 technologies

     const tableData: TableData[] =
          selectedTable === "Projects" ? projects :
               selectedTable === "Links" ? links : experiences;

     const filteredData = tableData.filter(item =>
          Object.values(item).some(value =>
               value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
     );

     const columnsToShow: Record<"Projects" | "Links" | "Experiences", string[]> = {
          Projects: ["title", "description", "technology"],
          Links: ["originalUrl", "shortUrl", "createdAt"],
          Experiences: ["company", "role", "year"],
     };

     const columns = columnsToShow[selectedTable];

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Overview</h1>

               {/* Card Statistics */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatedStatsCard
                         title="Total Projects"
                         finalValue={projects.length}
                         icon={FolderIcon}
                         isLoading={loading}
                    />
                    <AnimatedStatsCard
                         title="Total Links"
                         finalValue={links.length}
                         icon={LinkIcon}
                         isLoading={loading}
                    />
                    <AnimatedStatsCard
                         title="Total Experiences"
                         finalValue={experiences.length}
                         icon={BriefcaseIcon}
                         isLoading={loading}
                    />
               </div>

               <div className="mt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                         <div className="flex space-x-4 w-full">
                              <Select
                                   label="Choose Table:"
                                   options={[
                                        { label: "Projects", value: "Projects" },
                                        { label: "Links", value: "Links" },
                                        { label: "Experiences", value: "Experiences" },
                                   ]}
                                   value={selectedTable}
                                   onChange={(e) => setSelectedTable(e.target.value as "Projects" | "Links" | "Experiences")}
                                   className="w-48"
                              />

                              <Input
                                   type="text"
                                   placeholder="Type to search..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   label="Search"
                                   className=""
                              />
                         </div>
                    </div>

                    <div className="w-full overflow-hidden rounded-lg shadow-md">
                         <Table
                              data={filteredData}
                              columns={columns}
                              isLoading={loading}
                         />
                    </div>
               </div>

               {/* Technology Distribution Chart */}
               <div className="mt-6 bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Top Technologies</h3>
                    <ResponsiveContainer width="100%" height={200}>
                         <BarChart data={technologyChartData} width={50}>
                              <XAxis dataKey="name" />
                              <Tooltip />
                              <Bar dataKey="count" fill="#8884d8" />
                         </BarChart>
                    </ResponsiveContainer>
               </div>
          </div>
     );
}