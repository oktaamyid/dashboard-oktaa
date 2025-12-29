// src/app/(dashboard)/api-builder/page.tsx
"use client";

import Button from "@/components/ui/button";
import ApiBuilderForm from "@/components/features/api-builder/apiBuilderForm";
import ApiBuilderTable from "@/components/features/api-builder/apiBuilderTable";
import { useToast } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import { listEndpoints } from "@/lib/service";
import { ApiEndpoint } from "@/app/types";

export default function ApiBuilderPage() {
     const { showSuccess, showError } = useToast();
     const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
     const [loading, setLoading] = useState(true);
     const [showForm, setShowForm] = useState(false);
     const [editingEndpoint, setEditingEndpoint] = useState<ApiEndpoint | null>(null);
     const [showDocs, setShowDocs] = useState(false);
     const [docsEndpoint, setDocsEndpoint] = useState<ApiEndpoint | null>(null);

     const fetchEndpoints = async () => {
          setLoading(true);
          try {
               const data = await listEndpoints();
               setEndpoints(data);
          } catch (_err) {
               showError("Failed to fetch endpoints");
          } finally {
               setLoading(false);
          }
     };
     useEffect(() => {
          fetchEndpoints();
     }, [showError]);

     const handleAdd = () => {
          setEditingEndpoint(null);
          setShowForm(true);
     };

     const handleEdit = (endpoint: ApiEndpoint) => {
          setEditingEndpoint(endpoint);
          setShowForm(true);
     };

     const handleDelete = async (slug: string) => {
          if (!confirm("Are you sure you want to delete this endpoint?")) return;
          try {
               setLoading(true);
               const res = await fetch(`/api/${slug}`, { method: "DELETE" });
               if (!res.ok) throw new Error("Failed to delete endpoint");
               setEndpoints(endpoints => endpoints.filter(endpoint => endpoint.slug !== slug));
               showSuccess("Endpoint deleted");
          } catch (_err) {
               showError("Failed to delete endpoint");
          } finally {
               setLoading(false);
          }
     };

     const handleFormSubmit = async (endpoint: ApiEndpoint, isEdit: boolean) => {
          await fetchEndpoints();
          if (isEdit) {
               showSuccess("Endpoint updated!");
          } else {
               showSuccess("Endpoint created!");
               setDocsEndpoint(endpoint);
               setShowDocs(true);
          }
          setShowForm(false);
          setEditingEndpoint(null);
     };

     const handleFormCancel = () => {
          setShowForm(false);
          setEditingEndpoint(null);
     };

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">API Builder</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Construct Dynamic Endpoints</p>
                    </div>
                    {!showForm && (
                         <Button onClick={handleAdd} variant="primary" size="sm">+ Add Endpoint</Button>
                    )}
               </div>

               {showForm && (
                    <div className="bg-black border border-white/10 p-6 animate-in fade-in slide-in-from-top-4">
                         <ApiBuilderForm
                              initialData={editingEndpoint || undefined}
                              onSubmit={handleFormSubmit}
                              onCancel={handleFormCancel}
                         />
                    </div>
               )}

               <div className="border border-white/10 rounded-none overflow-hidden">
                    <ApiBuilderTable
                         endpoints={endpoints}
                         onEdit={handleEdit}
                         onDelete={handleDelete}
                         isLoading={loading}
                         onViewDocs={(endpoint) => {
                              setDocsEndpoint(endpoint);
                              setShowDocs(true);
                         }}
                    />
               </div>

               {/* Sharp Modal for Docs */}
               {showDocs && docsEndpoint && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-black border border-white/20 shadow-2xl max-w-lg w-full rounded-none">
                              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                   <h2 className="text-xl font-bold text-white uppercase tracking-tight">API Documentation</h2>
                                   <div className="badge badge-accent rounded-none uppercase text-xs font-bold">{docsEndpoint.method}</div>
                              </div>

                              <div className="p-6 space-y-4 font-mono text-sm">
                                   <div>
                                        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Endpoint URL</p>
                                        <div className="bg-zinc-900 p-3 border border-zinc-800 text-blue-400">/api/{docsEndpoint.slug}</div>
                                   </div>

                                   <div>
                                        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Expected Fields</p>
                                        <ul className="space-y-2">
                                             {docsEndpoint.fields.map(field => (
                                                  <li key={field.fieldName} className="flex items-center gap-2 border-b border-zinc-800 pb-2 last:border-0 last:pb-0">
                                                       <span className="text-white font-bold">{field.fieldName}</span>
                                                       <span className="text-zinc-500">({field.type})</span>
                                                       {field.required && <span className="text-red-500 text-[10px] uppercase border border-red-500/50 px-1">Required</span>}
                                                  </li>
                                             ))}
                                        </ul>
                                   </div>
                              </div>

                              <div className="p-4 bg-zinc-900 border-t border-white/10 flex justify-end">
                                   <Button onClick={() => setShowDocs(false)} variant="primary" size="sm">Close Documentation</Button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
