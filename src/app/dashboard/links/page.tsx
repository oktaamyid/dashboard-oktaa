"use client";

import { useEffect, useState } from "react";
import LinkTable from "@/components/features/links/linkTable";
import LinkForm from "@/components/features/links/linkForm";
import { getLinks, createLink, updateLink, deleteLink } from "@/lib/service";
import { Link } from "@/app/types";

export default function LinksPage() {
     const [links, setLinks] = useState<Link[]>([]);
     const [editingLink, setEditingLink] = useState<Link | null>(null);
     const [isFormVisible, setFormVisible] = useState(false);
     const [loading, setLoading] = useState(true);
     const [analyticsView, setAnalyticsView] = useState(false);

     useEffect(() => {
          async function fetchData() {
               try {
                    setLoading(true);
                    const data = await getLinks();
                    setLinks(data);
               } catch (error) {
                    console.error("Error fetching data: ", error);
               } finally {
                    setLoading(false);
               }
          }

          fetchData();

          // Set up refresh interval for analytics (every minute)
          const intervalId = setInterval(fetchData, 60000);

          return () => clearInterval(intervalId);
     }, []);

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
          await deleteLink(id);
          setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
     };

     return (
          <div>
               <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Links</h1>
                    <div className="flex space-x-2">
                         {!isFormVisible && (
                              <button
                                   onClick={() => setFormVisible(true)}
                                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                              >
                                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                   </svg>
                                   Add Link
                              </button>
                         )}

                         <button
                              onClick={() => setAnalyticsView(!analyticsView)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center"
                         >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              {analyticsView ? "Hide Analytics" : "Show Analytics"}
                         </button>
                    </div>
               </div>

               {isFormVisible ? (
                    <LinkForm
                         onSubmit={(data) => handleCreateOrUpdate(data)}
                         initialData={editingLink || undefined}
                         onCancel={() => {
                              setEditingLink(null);
                              setFormVisible(false);
                         }}
                    />
               ) : (
                    <LinkTable
                         links={links}
                         onEdit={(link) => {
                              setEditingLink(link);
                              setFormVisible(true);
                         }}
                         onDelete={handleDelete}
                         isLoading={loading}
                    />
               )}
          </div>
     );
}