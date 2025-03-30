import React from "react";
import { Link } from "@/app/types";
import { denormalizeReferer } from '@/lib/utils/normalizeReferer';

interface LinkAnalyticsProps {
     link: Link;
}

export default function LinkAnalytics({ link }: LinkAnalyticsProps) {
     // Prepare data for device stats
     const deviceData = [
          { name: "Desktop", value: link.deviceStats?.desktop || 0, color: "bg-blue-500" },
          { name: "Mobile", value: link.deviceStats?.mobile || 0, color: "bg-green-500" },
          { name: "Tablet", value: link.deviceStats?.tablet || 0, color: "bg-purple-500" }
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
               <div className="text-gray-400 italic text-center py-6">
                    No analytics data available yet
               </div>
          );
     }

     return (
          <div className="space-y-6 p-4">
               <h3 className="text-lg font-semibold text-gray-200">
                    Analytics for {link.nameUrl || link.shortUrl}
               </h3>

               <div className="text-center mb-6 p-4 bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-white">{link.clicks || 0}</div>
                    <div className="text-sm text-gray-400">Total Clicks</div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Device Stats */}
                    <div className="bg-gray-800 rounded-lg p-4 shadow">
                         <h4 className="font-medium text-gray-300 mb-3">Device Types</h4>
                         {deviceData.length > 0 ? (
                              <div className="space-y-3">
                                   {deviceData.map((device) => (
                                        <div key={device.name} className="space-y-1">
                                             <div className="flex justify-between text-sm">
                                                  <span className="text-gray-400">{device.name}</span>
                                                  <span className="text-gray-200 font-medium">
                                                       {device.value} ({Math.round((device.value / (link.clicks || 1)) * 100)}%)
                                                  </span>
                                             </div>
                                             <div className="w-full bg-gray-700 rounded-full h-2">
                                                  <div
                                                       className={`${device.color} h-2 rounded-full`}
                                                       style={{
                                                            width: `${Math.min(100, (device.value / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-gray-500 italic text-sm">
                                   No device data available
                              </div>
                         )}
                    </div>

                    {/* Browser Stats */}
                    <div className="bg-gray-800 rounded-lg p-4 shadow">
                         <h4 className="font-medium text-gray-300 mb-3">Top Browsers</h4>
                         {browserData.length > 0 ? (
                              <div className="space-y-3">
                                   {browserData.map((item) => (
                                        <div key={item.browser} className="space-y-1">
                                             <div className="flex justify-between text-sm">
                                                  <span className="text-gray-400">{item.browser}</span>
                                                  <span className="text-gray-200 font-medium">
                                                       {item.count} ({Math.round((item.count / (link.clicks || 1)) * 100)}%)
                                                  </span>
                                             </div>
                                             <div className="w-full bg-gray-700 rounded-full h-2">
                                                  <div
                                                       className="bg-cyan-500 h-2 rounded-full"
                                                       style={{
                                                            width: `${Math.min(100, (item.count / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-gray-500 italic text-sm">
                                   No browser data available
                              </div>
                         )}
                    </div>

                    {/* Geo Stats */}
                    <div className="bg-gray-800 rounded-lg p-4 shadow">
                         <h4 className="font-medium text-gray-300 mb-3">Top Locations</h4>
                         {geoData.length > 0 ? (
                              <div className="space-y-3">
                                   {geoData.map((item) => (
                                        <div key={item.country} className="space-y-1">
                                             <div className="flex justify-between text-sm">
                                                  <span className="text-gray-400">{item.country}</span>
                                                  <span className="text-gray-200 font-medium">
                                                       {item.count} ({Math.round((item.count / (link.clicks || 1)) * 100)}%)
                                                  </span>
                                             </div>
                                             <div className="w-full bg-gray-700 rounded-full h-2">
                                                  <div
                                                       className="bg-cyan-500 h-2 rounded-full"
                                                       style={{
                                                            width: `${Math.min(100, (item.count / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-gray-500 italic text-sm">
                                   No location data available
                              </div>
                         )}
                    </div>

                    {/* Referer Stats */}
                    <div className="bg-gray-800 rounded-lg p-4 shadow">
                         <h4 className="font-medium text-gray-300 mb-3">Top Referrers</h4>
                         {refererData.length > 0 ? (
                              <div className="space-y-3">
                                   {refererData.map((item) => (
                                        <div key={item.referer} className="space-y-1">
                                             <div className="flex justify-between text-sm">
                                                  <span className="text-gray-400 truncate max-w-[120px]" title={item.referer}>
                                                       {item.referer || "Direct"}
                                                  </span>
                                                  <span className="text-gray-200 font-medium">
                                                       {item.count} ({Math.round((item.count / (link.clicks || 1)) * 100)}%)
                                                  </span>
                                             </div>
                                             <div className="w-full bg-gray-700 rounded-full h-2">
                                                  <div
                                                       className="bg-pink-500 h-2 rounded-full"
                                                       style={{
                                                            width: `${Math.min(100, (item.count / (link.clicks || 1)) * 100)}%`
                                                       }}
                                                  ></div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         ) : (
                              <div className="text-gray-500 italic text-sm">
                                   No referrer data available
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}