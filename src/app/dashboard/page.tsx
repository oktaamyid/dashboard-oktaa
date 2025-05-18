"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences, getProjects, getLinks, getSubdomains } from "@/lib/service";
import { Experience, Project, Link, Subdomain } from "@/app/types";
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { LinkIcon, FolderIcon, BriefcaseIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedStatsCard from '@/components/ui/animatedStatsCard';
import { formatArrayCell } from "@/lib/utils/formatArray";

export default function Overview() {
     const [selectedTable, setSelectedTable] = useState<"Projects" | "Links" | "Experiences" | "Subdomains">("Projects");
     const [projects, setProjects] = useState<Project[]>([]);
     const [links, setLinks] = useState<Link[]>([]);
     const [experiences, setExperiences] = useState<Experience[]>([]);
     const [subdomains, setSubdomains] = useState<Subdomain[]>([]); 
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");

     useEffect(() => {
          const fetchData = async () => {
               setLoading(true);
               try {
                    const [projectsData, linksData, experiencesData, subdomainsData] = await Promise.all([
                         getProjects(),
                         getLinks(),
                         getExperiences(),
                         getSubdomains()
                    ]);
                    setProjects(projectsData);
                    setLinks(linksData);
                    setExperiences(experiencesData);
                    setSubdomains(subdomainsData);
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

     const tableData: (Project | Link | Experience | Subdomain)[] =
          selectedTable === "Projects" ? projects :
               selectedTable === "Links" ? links :
                    selectedTable === "Experiences" ? experiences : subdomains;

     const filteredData = tableData.filter(item =>
          Object.values(item).some(value =>
               value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
     );

     const columnsToShow: Record<"Projects" | "Links" | "Experiences" | "Subdomains", string[]> = {
          Projects: ["title", "description", "technology"],
          Links: ["nameUrl", "originalUrl", "shortUrl", "clicks", "status"],
          Experiences: ["company", "role", "year", "techStack"],
          Subdomains: ["name", "type", "content"]
     };

     const arrayColumnsMap: Record<"Projects" | "Links" | "Experiences" | "Subdomains", string[]> = {
          Projects: ["technology"],
          Links: [],
          Experiences: ["techStack"],
          Subdomains: []
     };

     const columns = columnsToShow[selectedTable];

     const renderCell = (column: string, row: Project | Link | Experience | Subdomain) => {
          if (selectedTable === "Links") {
               const link = row as Link;
               switch (column) {
                    case 'nameUrl':
                         return (
                              <span className="text-white">
                                   {link.nameUrl || '-'}
                              </span>
                         );
                    case 'originalUrl':
                         return (
                              <span className="text-gray-300 truncate max-w-xs block" title={link.originalUrl}>
                                   {link.originalUrl}
                              </span>
                         );
                    case 'shortUrl':
                         return (
                              <a
                                   href={`/${link.shortUrl}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-blue-400 hover:underline"
                              >
                                   /{link.shortUrl}
                              </a>
                         );
                    case 'clicks':
                         return (
                              <span className="text-white">
                                   {link.clicks || 0}
                              </span>
                         );
                    case 'status':
                         return (
                              <div className="flex flex-col text-sm text-gray-300">
                                   <span>Portal: {link.showToPortal ? "Yes" : "No"}</span>
                                   <span>Confirm: {link.showConfirmationPage ? "Yes" : "No"}</span>
                              </div>
                         );
               }
          }

          if (arrayColumnsMap[selectedTable].includes(column)) {
               return formatArrayCell(row[column as keyof typeof row]);
          }

          return row[column as keyof typeof row] as React.ReactNode;
     };

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Overview</h1>

               {/* Card Statistics */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <AnimatedStatsCard
                         title="Total Subdomains"
                         finalValue={subdomains.length}
                         icon={GlobeAltIcon}
                         isLoading={loading}
                    />
               </div>

               <div className="mt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                         <div className="flex flex-col sm:flex-row sm:space-x-4 w-full space-y-4 sm:space-y-0">
                              <Select
                                   label="Choose Table:"
                                   options={[
                                        { label: "Projects", value: "Projects" },
                                        { label: "Links", value: "Links" },
                                        { label: "Experiences", value: "Experiences" },
                                        { label: "Subdomains", value: "Subdomains" }
                                   ]}
                                   value={selectedTable}
                                   onChange={(e) => setSelectedTable(e.target.value as "Projects" | "Links" | "Experiences" | "Subdomains")}
                                   className="w-full sm:w-48"
                              />

                              <Input
                                   type="text"
                                   placeholder="Type to search..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   label="Search"
                                   className="w-full"
                              />
                         </div>
                    </div>

                    <div className="w-full rounded-lg shadow-md">
                         <Table
                              data={filteredData}
                              columns={columns}
                              isLoading={loading}
                              renderCell={renderCell}
                         />   
                    </div>
               </div>

               {/* Technology Distribution Chart */}
               <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Top Technologies</h3>
                    <ResponsiveContainer width="100%" height={200}>
                         <BarChart data={technologyChartData} width={50}>
                              <XAxis dataKey="name" stroke="#fff" />
                              <Tooltip
                                   contentStyle={{ backgroundColor: '#374151', borderColor: '#4B5563' }}
                                   itemStyle={{ color: '#fff' }}
                              />
                              <Bar dataKey="count" fill="#8884d8" />
                         </BarChart>
                    </ResponsiveContainer>
               </div>
          </div>
     );
}