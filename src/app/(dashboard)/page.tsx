"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences, getProjects, getLinks, getSubdomains } from "@/lib/service";
import { Experience, Project, Link, Subdomain } from "@/app/types";
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { LinkIcon, FolderIcon, BriefcaseIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
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

     const columnLabels: Record<string, string> = {
          title: "Project Title",
          description: "Brief",
          technology: "Tech Stack",
          nameUrl: "Link Name",
          originalUrl: "Destination",
          shortUrl: "Slug",
          clicks: "Hits",
          status: "Config",
          company: "Organization",
          role: "Position",
          year: "Period",
          techStack: "Technologies",
          name: "Subdomain",
          type: "Record Type",
          content: "Target"
     };

     const renderCell = (column: string, row: Project | Link | Experience | Subdomain) => {
          if (selectedTable === "Links") {
               const link = row as Link;
               switch (column) {
                    case 'nameUrl':
                         return (
                              <span className="text-white font-bold">
                                   {link.nameUrl || '-'}
                              </span>
                         );
                    case 'originalUrl':
                         return (
                              <span className="text-zinc-500 truncate max-w-xs block font-mono text-[10px]" title={link.originalUrl}>
                                   {link.originalUrl}
                              </span>
                         );
                    case 'shortUrl':
                         return (
                              <a
                                   href={`/${link.shortUrl}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-white hover:underline decoration-white/30 underline-offset-4"
                              >
                                   /{link.shortUrl}
                              </a>
                         );
                    case 'clicks':
                         return (
                              <span className="text-white font-mono">
                                   {link.clicks || 0}
                              </span>
                         );
                    case 'status':
                         return (
                              <div className="flex gap-2">
                                   <div className={`badge badge-xs rounded-none ${link.showToPortal ? 'badge-success' : 'badge-ghost text-zinc-600'}`}>P</div>
                                   <div className={`badge badge-xs rounded-none ${link.showConfirmationPage ? 'badge-warning' : 'badge-ghost text-zinc-600'}`}>C</div>
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
          <div className="space-y-8">
               <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Overview</h1>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">System Status & Analytics</p>
               </div>

               {/* Card Statistics */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AnimatedStatsCard
                         title="Projects"
                         finalValue={projects.length}
                         icon={FolderIcon}
                         isLoading={loading}
                    />
                    <AnimatedStatsCard
                         title="Active Links"
                         finalValue={links.length}
                         icon={LinkIcon}
                         isLoading={loading}
                    />
                    <AnimatedStatsCard
                         title="Experiences"
                         finalValue={experiences.length}
                         icon={BriefcaseIcon}
                         isLoading={loading}
                    />
                    <AnimatedStatsCard
                         title="Subdomains"
                         finalValue={subdomains.length}
                         icon={GlobeAltIcon}
                         isLoading={loading}
                    />
               </div>

               {/* Main Data Table Area - Full Width */}
               <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-end border-b border-white/10 pb-6">
                         <Select
                              label="Data Source"
                              options={[
                                   { label: "Projects Directory", value: "Projects" },
                                   { label: "Short Links", value: "Links" },
                                   { label: "Experience Log", value: "Experiences" },
                                   { label: "Subdomains", value: "Subdomains" }
                              ]}
                              value={selectedTable}
                              onChange={(e) => setSelectedTable(e.target.value as "Projects" | "Links" | "Experiences" | "Subdomains")}
                              className="w-full sm:w-64"
                         />

                         <div className="w-full sm:max-w-xs">
                              <Input
                                   type="text"
                                   placeholder="Filter records..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   label="Global Search"
                                   className="w-full"
                              />
                         </div>
                    </div>

                    <div className="border border-white/10 rounded-none overflow-hidden bg-black">
                         <Table
                              data={filteredData}
                              columns={columns}
                              columnLabels={columnLabels}
                              isLoading={loading}
                              renderCell={renderCell}
                         />
                    </div>
               </div>
          </div>
     );
}