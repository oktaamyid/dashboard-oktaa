"use client";

import { useEffect, useState } from "react";
import LinkTable from "@/components/features/links/linkTable";
import LinkForm from "@/components/features/links/linkForm";
import { createLink, updateLink, deleteLink } from "@/lib/service";
import { Link, AnalyticsSummary } from "@/app/types";
import AnimatedStatsCard from '@/components/ui/animatedStatsCard';
import DivContainer from '@/components/ui/container';
import { CursorArrowRippleIcon, ChartBarIcon, DeviceTabletIcon, GlobeAltIcon, MapIcon, LinkIcon } from '@heroicons/react/24/solid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { denormalizeReferer } from "@/lib/utils/normalizeReferer";
import Card from "@/components/ui/card";
import { onSnapshot, query, collection } from "firebase/firestore";
import { db } from '@/lib/firebaseConfig';
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function LinksPage() {
     const { showSuccess, showError } = useToast();
     const [links, setLinks] = useState<Link[]>([]);
     const [editingLink, setEditingLink] = useState<Link | null>(null);
     const [isFormVisible, setFormVisible] = useState(false);
     const [loading, setLoading] = useState(true);
     const [analyticsView, setAnalyticsView] = useState(true);
     const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);

     // Calculate analytics data
     const calculateAnalytics = (links: Link[]): AnalyticsSummary => {
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
     };

     const handleCreateOrUpdate = async (linkData: Omit<Link, "id">) => {
          if (editingLink) {
               // Update jika sedang dalam mode edit
               await updateLink(editingLink.id, linkData);
               setLinks((prevLinks) =>
                    prevLinks.map((link) => (link.id === editingLink.id ? { ...link, ...linkData } : link))
               );
          } else {
               // Create jika tidak dalam mode edit
               const newLink = await createLink(linkData);
               setLinks((prevLinks) => [...prevLinks, { id: newLink.id, ...linkData }]);
          }

          setEditingLink(null);
          setFormVisible(false);
     };

     const handleDelete = async (id: string) => {
          try {
               await deleteLink(id);
               setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
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

     // const handleResetAnalytics = async () => {
     //      if (confirm("Are you sure you want to reset all link analytics? This cannot be undone.")) {
     //          try {
     //              await resetLinkAnalytics();
     //              alert("Analytics reset successfully.");
     //          } catch (error) {
     //              console.error("Error resetting analytics: ", error);
     //              alert("Failed to reset analytics.");
     //          }
     //      }
     // };

     useEffect(() => {
          const q = query(collection(db, "links"));
          const unsubscribe = onSnapshot(q, (snapshot) => {
               try {
                    setLoading(true);
                    const linksData: Link[] = snapshot.docs.map(doc => ({
                         id: doc.id,
                         ...doc.data()
                    })) as Link[];
                    setLinks(linksData);
                    setAnalyticsData(calculateAnalytics(linksData));
               } catch (error) {
                    console.error("Error fetching real-time data: ", error);
               } finally {
                    setLoading(false);
               }
          }, (error) => {
               console.error("Firestore listener error: ", error);
               setLoading(false);
          });

          // Clean up listener on unmount
          return () => unsubscribe();
     }, []);

     const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

     return (
          <div>
               <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Links</h1>
                    <div className="flex space-x-2">
                         {!isFormVisible && (
                              <Button
                                   onClick={() => {
                                        setFormVisible(true);
                                   }}
                                   className="flex items-center"
                                   variant="primary"
                                   
                              >
                                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                   </svg>
                                   Add Link
                              </Button>
                         )}

                         <Button
                              onClick={() => setAnalyticsView(!analyticsView)}
                              className="flex items-center"
                              variant="secondary"
                         >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              {analyticsView ? "Hide Analytics" : "Show Analytics"}
                         </Button>

                    </div>
               </div>

               {isFormVisible && (
                    <LinkForm
                         onSubmit={(data) => handleCreateOrUpdate(data)}
                         initialData={editingLink || undefined}
                         onCancel={handleCancel}
                    />
               )}
               
               <LinkTable
                    links={links}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={loading}
               />

               {analyticsView && analyticsData && (
                    <div className="my-6 space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Summary Cards */}
                              <AnimatedStatsCard
                                   title="Total Click"
                                   finalValue={analyticsData.totalClicks}
                                   icon={CursorArrowRippleIcon}
                              />

                              <Card
                                   title="Average Clicks per Link"
                                   value={analyticsData.averageClicks.toFixed(1)}
                                   icon={ChartBarIcon}
                              />

                         </div>

                         {/* Top Links Chart */}
                         <DivContainer className="p-4" hoverEffect={false}>
                              <h3 className="font-medium text-gray-300 mb-4">Top Performing Links</h3>
                              <div className="h-64">
                                   <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analyticsData.topLinks}>
                                             <XAxis dataKey="name" stroke="#d1d5db" />
                                             <YAxis stroke="#d1d5db" />
                                             <Tooltip
                                                  contentStyle={{
                                                       backgroundColor: '#374151',
                                                       borderColor: '#4b5563',
                                                       borderRadius: '0.5rem'
                                                  }}
                                             />
                                             <Legend />
                                             <Bar
                                                  dataKey="clicks"
                                                  fill="#8884d8"
                                                  name="Clicks"
                                                  radius={[4, 4, 0, 0]}
                                             />
                                        </BarChart>
                                   </ResponsiveContainer>
                              </div>
                         </DivContainer>

                         {/* Distribution Charts */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Device Distribution */}
                              <DivContainer className="p-4" hoverEffect={false} icon={DeviceTabletIcon}>
                                   <h3 className="font-medium text-gray-300 mb-4">Device Distribution</h3>
                                   <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <PieChart>
                                                  <Pie
                                                       data={analyticsData.deviceDistribution}
                                                       cx="50%"
                                                       cy="50%"
                                                       labelLine={false}
                                                       outerRadius={70}
                                                       fill="#8884d8"
                                                       dataKey="value"
                                                       nameKey="name"
                                                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                  >
                                                       {analyticsData.deviceDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                       ))}
                                                  </Pie>
                                                  <Tooltip
                                                       contentStyle={{
                                                            backgroundColor: '#374151',
                                                            borderColor: '#4b5563',
                                                            borderRadius: '0.5rem'
                                                       }}
                                                  />
                                             </PieChart>
                                        </ResponsiveContainer>
                                   </div>
                              </DivContainer>

                              {/* Referrer Distribution */}
                              <DivContainer className="p-4" hoverEffect={false} icon={LinkIcon}>
                                   <h3 className="font-medium text-gray-300 mb-4">Top Referrers</h3>
                                   <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <PieChart>
                                                  <Pie
                                                       data={analyticsData.referrerDistribution}
                                                       cx="50%"
                                                       cy="50%"
                                                       labelLine={false}
                                                       outerRadius={70}
                                                       fill="#8884d8"
                                                       dataKey="value"
                                                       nameKey="name"
                                                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                  >
                                                       {analyticsData.referrerDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                       ))}
                                                  </Pie>
                                                  <Tooltip
                                                       contentStyle={{
                                                            backgroundColor: '#374151',
                                                            borderColor: '#4b5563',
                                                            borderRadius: '0.5rem'
                                                       }}
                                                  />
                                             </PieChart>
                                        </ResponsiveContainer>
                                   </div>
                              </DivContainer>

                              {/* Geo Distribution */}
                              <DivContainer className="p-4" hoverEffect={false} icon={MapIcon}>
                                   <h3 className="font-medium text-gray-300 mb-4">Top Locations</h3>
                                   <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <PieChart>
                                                  <Pie
                                                       data={analyticsData.geoDistribution}
                                                       cx="50%"
                                                       cy="50%"
                                                       labelLine={false}
                                                       outerRadius={70}
                                                       fill="#8884d8"
                                                       dataKey="value"
                                                       nameKey="name"
                                                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                  >
                                                       {analyticsData.geoDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                       ))}
                                                  </Pie>
                                                  <Tooltip
                                                       contentStyle={{
                                                            backgroundColor: '#374151',
                                                            borderColor: '#4b5563',
                                                            borderRadius: '0.5rem'
                                                       }}
                                                  />
                                             </PieChart>
                                        </ResponsiveContainer>
                                   </div>
                              </DivContainer>

                              {/* Browser Distribution */}
                              <DivContainer className="p-4" hoverEffect={false} icon={GlobeAltIcon}>
                                   <h3 className="font-medium text-gray-300 mb-4">Top Browsers</h3>
                                   <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                             <PieChart>
                                                  <Pie
                                                       data={analyticsData.browserDistribution}
                                                       cx="50%"
                                                       cy="50%"
                                                       labelLine={false}
                                                       outerRadius={70}
                                                       fill="#8884d8"
                                                       dataKey="value"
                                                       nameKey="name"
                                                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                  >
                                                       {analyticsData.browserDistribution.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                       ))}
                                                  </Pie>
                                                  <Tooltip
                                                       contentStyle={{
                                                            backgroundColor: '#374151',
                                                            borderColor: '#4b5563',
                                                            borderRadius: '0.5rem'
                                                       }}
                                                  />
                                             </PieChart>
                                        </ResponsiveContainer>
                                   </div>
                              </DivContainer>
                         </div>
                    </div>
               )}

          </div>
     );
}