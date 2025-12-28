"use client";

import { useEffect, useState, useMemo } from "react";
import LinkTable from "@/components/features/links/linkTable";
import LinkForm from "@/components/features/links/linkForm";
import { createLink, updateLink, deleteLink } from "@/lib/service";
import { Link, AnalyticsSummary } from "@/app/types";
import AnimatedStatsCard from '@/components/ui/animatedStatsCard';
import DivContainer from '@/components/ui/container';
import { CursorArrowRippleIcon, ChartBarIcon, DeviceTabletIcon, GlobeAltIcon, MapIcon, LinkIcon } from '@heroicons/react/24/solid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { denormalizeReferer } from "@/lib/utils/normalizeReferer";
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function LinksPage() {
     const { showError } = useToast();
     const [links, setLinks] = useState<Link[]>([]);
     const [editingLink, setEditingLink] = useState<Link | null>(null);
     const [isFormVisible, setFormVisible] = useState(false);
     const [loading, setLoading] = useState(true);
     const [analyticsView, setAnalyticsView] = useState(true);

     // Calculate analytics data derived from links
     const analyticsData = useMemo<AnalyticsSummary | null>(() => {
          if (links.length === 0 && !loading) return null;

          const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
          const averageClicks = links.length > 0 ? totalClicks / links.length : 0;

          // Top 5 performing links
          const topLinks = [...links]
               .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
               .slice(0, 5)
               .map(link => ({
                    name: link.nameUrl || link.shortUrl || 'Unnamed',
                    clicks: link.clicks || 0
               }));

          // Device distribution
          const deviceStats = links.reduce((acc, link) => {
               if (link.deviceStats) {
                    acc.desktop = (acc.desktop || 0) + (link.deviceStats.desktop || 0);
                    acc.mobile = (acc.mobile || 0) + (link.deviceStats.mobile || 0);
                    acc.tablet = (acc.tablet || 0) + (link.deviceStats.tablet || 0);
               }
               return acc;
          }, { desktop: 0, mobile: 0, tablet: 0 });

          const deviceDistribution = [
               { name: 'Desktop', value: deviceStats.desktop },
               { name: 'Mobile', value: deviceStats.mobile },
               { name: 'Tablet', value: deviceStats.tablet }
          ].filter(item => item.value > 0);

          // Referrer distribution
          const referrerStats = links.reduce((acc, link) => {
               if (link.refererStats) {
                    Object.entries(link.refererStats).forEach(([referrer, count]) => {
                         acc[referrer] = (acc[referrer] || 0) + count;
                    });
               }
               return acc;
          }, {} as Record<string, number>);

          const referrerDistribution = Object.entries(referrerStats)
               .sort((a, b) => b[1] - a[1])
               .slice(0, 5)
               .map(([name, value]) => ({
                    name: denormalizeReferer(name),
                    value: Number(value)
               }))

          // Geo distribution
          const geoStats = links.reduce((acc, link) => {
               if (link.geoStats) {
                    Object.entries(link.geoStats).forEach(([location, count]) => {
                         acc[location] = (acc[location] || 0) + count;
                    });
               }
               return acc;
          }, {} as Record<string, number>);

          const geoDistribution = Object.entries(geoStats)
               .sort((a, b) => b[1] - a[1])
               .slice(0, 5)
               .map(([name, value]) => ({ name, value }));

          const browserStats = links.reduce((acc, link) => {
               if (link.browserStats) {
                    Object.entries(link.browserStats).forEach(([browser, count]) => {
                         acc[browser] = (acc[browser] || 0) + count;
                    })
               }
               return acc;
          }, {} as Record<string, number>);

          const browserDistribution = Object.entries(browserStats)
               .sort((a, b) => b[1] - a[1])
               .slice(0, 5)
               .map(([name, value]) => ({ name, value }));

          return {
               totalClicks,
               averageClicks,
               topLinks,
               deviceDistribution,
               referrerDistribution,
               geoDistribution,
               browserDistribution
          };
     }, [links, loading]);

     const handleCreateOrUpdate = async (linkData: Omit<Link, "id">) => {
          try {
               if (editingLink) {
                    // Update jika sedang dalam mode edit
                    await updateLink(editingLink.id, linkData);
                    const updatedLinks = links.map((link) => (link.id === editingLink.id ? { ...link, ...linkData } : link));
                    setLinks(updatedLinks);
               } else {
                    // Create jika tidak dalam mode edit
                    const newLink = await createLink(linkData);
                    const updatedLinks = [...links, { id: newLink.id, ...linkData }];
                    setLinks(updatedLinks);
               }

               setEditingLink(null);
               setFormVisible(false);
          } catch (error) {
               showError('Failed to save link');
               console.error(error);
          }
     };

     const handleDelete = async (id: string) => {
          try {
               await deleteLink(id);
               const updatedLinks = links.filter((link) => link.id !== id);
               setLinks(updatedLinks);
          } catch (error) {
               showError('Failed to delete link');
               console.error(error);
          }
     };

     const handleEdit = (link: Link) => {
          setEditingLink(link);
          setFormVisible(true);
     }

     const handleCancel = () => {
          setEditingLink(null);
          setFormVisible(false);
     };

     useEffect(() => {
          const fetchLinks = async () => {
               try {
                    setLoading(true);
                    const { getLinks } = await import("@/lib/service");
                    const linksData = await getLinks();
                    setLinks(linksData);
               } catch (error) {
                    console.error("Error fetching links: ", error);
               } finally {
                    setLoading(false);
               }
          };

          fetchLinks();
     }, []);

     const COLORS = ['#FFFFFF', '#A1A1AA', '#52525B', '#27272A', '#000000'];

     return (
          <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Links Manager</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Create, Track & Analyze Shortlinks</p>
                    </div>
                    <div className="flex gap-2">
                         {!isFormVisible && (
                              <Button
                                   onClick={() => setFormVisible(true)}
                                   variant="primary"
                                   size="sm"
                              >
                                   ADD NEW LINK
                              </Button>
                         )}

                         <Button
                              onClick={() => setAnalyticsView(!analyticsView)}
                              variant="secondary"
                              size="sm"
                         >
                              {analyticsView ? "HIDE METRICS" : "SHOW METRICS"}
                         </Button>

                    </div>
               </div>

               {isFormVisible && (
                    <div className="bg-black border border-white/10 p-6 animate-in fade-in slide-in-from-top-4">
                         <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">{editingLink ? 'Edit Link' : 'Create New Link'}</h3>
                         <LinkForm
                              onSubmit={(data) => handleCreateOrUpdate(data)}
                              initialData={editingLink || undefined}
                              onCancel={handleCancel}
                         />
                    </div>
               )}

               <div className="grid grid-cols-1 gap-8">
                    <div className="border border-white/10 rounded-none overflow-hidden">
                         <LinkTable
                              links={links}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              isLoading={loading}
                         />
                    </div>

                    {analyticsView && analyticsData && (
                         <div className="space-y-6 animate-in fade-in">
                              <div className="flex items-center gap-2 mb-2">
                                   <div className="h-px bg-white/20 flex-1"></div>
                                   <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Analytics Overview</span>
                                   <div className="h-px bg-white/20 flex-1"></div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <AnimatedStatsCard
                                        title="Total Clicks"
                                        finalValue={analyticsData.totalClicks}
                                        icon={CursorArrowRippleIcon}
                                   />

                                   <AnimatedStatsCard
                                        title="Avg. Click / Link"
                                        finalValue={Number(analyticsData.averageClicks.toFixed(1))}
                                        icon={ChartBarIcon}
                                   />
                              </div>

                              {/* Top Links Chart */}
                              <DivContainer className="p-6">
                                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Top Performing Links</h3>
                                   <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <BarChart data={analyticsData.topLinks}>
                                                  <XAxis dataKey="name" stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} />
                                                  <YAxis stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} />
                                                  <Tooltip
                                                       cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                       contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff', borderRadius: 0 }}
                                                       itemStyle={{ color: '#fff' }}
                                                  />
                                                  <Bar
                                                       dataKey="clicks"
                                                       fill="#fff"
                                                       radius={[0, 0, 0, 0]}
                                                       barSize={40}
                                                  />
                                             </BarChart>
                                        </ResponsiveContainer>
                                   </div>
                              </DivContainer>

                              {/* Distribution Charts */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                   {/* Device Distribution */}
                                   <DivContainer className="p-4" hoverEffect={false}>
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Device Split</h3>
                                        <div className="h-40">
                                             <ResponsiveContainer width="100%" height="100%">
                                                  <PieChart>
                                                       <Pie
                                                            data={analyticsData.deviceDistribution}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={40}
                                                            outerRadius={60}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            nameKey="name"
                                                            stroke="black"
                                                       >
                                                            {analyticsData.deviceDistribution.map((entry, index) => (
                                                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                       </Pie>
                                                       <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                                                  </PieChart>
                                             </ResponsiveContainer>
                                        </div>
                                   </DivContainer>

                                   {/* Referrer Distribution */}
                                   <DivContainer className="p-4" hoverEffect={false}>
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Top Referrers</h3>
                                        <div className="h-40">
                                             <ResponsiveContainer width="100%" height="100%">
                                                  <PieChart>
                                                       <Pie
                                                            data={analyticsData.referrerDistribution}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={40}
                                                            outerRadius={60}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            nameKey="name"
                                                            stroke="black"
                                                       >
                                                            {analyticsData.referrerDistribution.map((entry, index) => (
                                                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                       </Pie>
                                                       <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                                                  </PieChart>
                                             </ResponsiveContainer>
                                        </div>
                                   </DivContainer>

                                   {/* Geo Distribution */}
                                   <DivContainer className="p-4" hoverEffect={false}>
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Locations</h3>
                                        <div className="h-40">
                                             <ResponsiveContainer width="100%" height="100%">
                                                  <PieChart>
                                                       <Pie
                                                            data={analyticsData.geoDistribution}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={40}
                                                            outerRadius={60}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            nameKey="name"
                                                            stroke="black"
                                                       >
                                                            {analyticsData.geoDistribution.map((entry, index) => (
                                                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                       </Pie>
                                                       <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                                                  </PieChart>
                                             </ResponsiveContainer>
                                        </div>
                                   </DivContainer>

                                   {/* Browser Distribution */}
                                   <DivContainer className="p-4" hoverEffect={false}>
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Browsers</h3>
                                        <div className="h-40">
                                             <ResponsiveContainer width="100%" height="100%">
                                                  <PieChart>
                                                       <Pie
                                                            data={analyticsData.browserDistribution}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={40}
                                                            outerRadius={60}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            nameKey="name"
                                                            stroke="black"
                                                       >
                                                            {analyticsData.browserDistribution.map((entry, index) => (
                                                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                       </Pie>
                                                       <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }} />
                                                  </PieChart>
                                             </ResponsiveContainer>
                                        </div>
                                   </DivContainer>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}