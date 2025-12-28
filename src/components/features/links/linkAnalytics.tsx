import React from "react";
import { Link } from "@/app/types";
import { denormalizeReferer } from '@/lib/utils/normalizeReferer';

interface LinkAnalyticsProps {
     link: Link;
}

export default function LinkAnalytics({ link }: LinkAnalyticsProps) {
     // Prepare data for device stats
     const deviceData = [
          { name: "Desktop", value: link.deviceStats?.desktop || 0, color: "bg-white" },
          { name: "Mobile", value: link.deviceStats?.mobile || 0, color: "bg-zinc-400" },
          { name: "Tablet", value: link.deviceStats?.tablet || 0, color: "bg-zinc-600" }
     ].filter(item => item.value > 0);

     // Prepare data for browser stats (top 5 browser)
     const browserData = Object.entries(link.browserStats || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([browser, count]) => ({ browser, count }));

     // Prepare data for geo stats (top 5 countries)
     const geoData = Object.entries(link.geoStats || {})
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([country, count]) => ({ country, count }));

     // Prepare data for referrer stats (top 5 referrers)
     const refererData = Object.entries(link.refererStats || {})
          .map(([referer, count]) => ({
               referer: denormalizeReferer(referer),
               count: Number(count)
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

     if (!link.clicks) {
          return (
               <div className="text-zinc-500 text-xs uppercase tracking-widest text-center py-12 border border-white/10 bg-black">
                    No analytics data available yet
               </div>
          );
     }

     return (
          <div className="space-y-6">
               <h3 className="text-lg font-black text-white uppercase tracking-tighter my-4 mx-5">
                    Analytics for {link.nameUrl || link.shortUrl}
               </h3>

               {/* Total Clicks Card */}
               <div className="text-center p-8 bg-black border border-white/10">
                    <div className="text-5xl font-black text-white font-outfit mb-2">{link.clicks || 0}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Total Clicks</div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {/* Device Stats */}
                    <div className="bg-black border border-white/10 p-6">
                         <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Device Types</h4>
                         {deviceData.length > 0 ? (
                              <div className="space-y-4">
                                   {deviceData.map((device) => (
                                        <div key={device.name} className="space-y-2">
                                             <div className="flex justify-between text-xs uppercase tracking-wide">
                                                  <span className="text-zinc-400">{device.name}</span>
                                                  <span className="text-white font-bold">
                                                       {device.value} <span className="text-zinc-600">({Math.round((device.value / (link.clicks || 1)) * 100)}%)</span>
                                                  </span>
                                             </div>
                                             <div className="w-full bg-zinc-900 h-1">
                                                  <div
                                                       className={`${device.color} h-1`}
                                                       style={{
                                                            width: `${Math.min(100, (device.value / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-zinc-600 text-[10px] uppercase tracking-widest">
                                   No data
                              </div>
                         )}
                    </div>

                    {/* Browser Stats */}
                    <div className="bg-black border border-white/10 p-6">
                         <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Top Browsers</h4>
                         {browserData.length > 0 ? (
                              <div className="space-y-4">
                                   {browserData.map((item) => (
                                        <div key={item.browser} className="space-y-2">
                                             <div className="flex justify-between text-xs uppercase tracking-wide">
                                                  <span className="text-zinc-400">{item.browser}</span>
                                                  <span className="text-white font-bold">
                                                       {item.count} <span className="text-zinc-600">({Math.round((item.count / (link.clicks || 1)) * 100)}%)</span>
                                                  </span>
                                             </div>
                                             <div className="w-full bg-zinc-900 h-1">
                                                  <div
                                                       className="bg-zinc-200 h-1"
                                                       style={{
                                                            width: `${Math.min(100, (item.count / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-zinc-600 text-[10px] uppercase tracking-widest">
                                   No data
                              </div>
                         )}
                    </div>

                    {/* Geo Stats */}
                    <div className="bg-black border border-white/10 p-6">
                         <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Top Locations</h4>
                         {geoData.length > 0 ? (
                              <div className="space-y-4">
                                   {geoData.map((item) => (
                                        <div key={item.country} className="space-y-2">
                                             <div className="flex justify-between text-xs uppercase tracking-wide">
                                                  <span className="text-zinc-400">{item.country}</span>
                                                  <span className="text-white font-bold">
                                                       {item.count} <span className="text-zinc-600">({Math.round((item.count / (link.clicks || 1)) * 100)}%)</span>
                                                  </span>
                                             </div>
                                             <div className="w-full bg-zinc-900 h-1">
                                                  <div
                                                       className="bg-zinc-200 h-1"
                                                       style={{
                                                            width: `${Math.min(100, (item.count / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-zinc-600 text-[10px] uppercase tracking-widest">
                                   No data
                              </div>
                         )}
                    </div>

                    {/* Referer Stats */}
                    <div className="bg-black border border-white/10 p-6">
                         <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Top Referrers</h4>
                         {refererData.length > 0 ? (
                              <div className="space-y-4">
                                   {refererData.map((item) => (
                                        <div key={item.referer} className="space-y-2">
                                             <div className="flex justify-between text-xs uppercase tracking-wide">
                                                  <span className="text-zinc-400 truncate max-w-40" title={item.referer}>
                                                       {item.referer || "Direct"}
                                                  </span>
                                                  <span className="text-white font-bold">
                                                       {item.count} <span className="text-zinc-600">({Math.round((item.count / (link.clicks || 1)) * 100)}%)</span>
                                                  </span>
                                             </div>
                                             <div className="w-full bg-zinc-900 h-1">
                                                  <div
                                                       className="bg-zinc-200 h-1"
                                                       style={{
                                                            width: `${Math.min(100, (item.count / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-zinc-600 text-[10px] uppercase tracking-widest">
                                   No data
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}