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

     useEffect(() => {
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

     const handleFormSubmit = (endpoint: ApiEndpoint, isEdit: boolean) => {
          if (isEdit) {
               setEndpoints(endpoints => endpoints.map(ep => ep.id === endpoint.id ? endpoint : ep));
               showSuccess("Endpoint updated!");
          } else {
               setEndpoints(endpoints => [...endpoints, endpoint]);
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

     // handleViewDocs removed (was unused)

     return (
          <div className="">
               <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Dynamic API Builder</h1>
                    {!showForm && (
                         <Button onClick={handleAdd} variant="primary">+ Add Endpoint</Button>
                    )}
               </div>
               {showForm && (
                    <ApiBuilderForm
                         initialData={editingEndpoint || undefined}
                         onSubmit={handleFormSubmit}
                         onCancel={handleFormCancel}
                    />
               )}
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
               {showDocs && docsEndpoint && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                         <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
                              <h2 className="text-xl font-bold mb-4 text-white">API Documentation</h2>
                              <p><strong className="text-gray-300">Endpoint:</strong> <span className="text-blue-400">/api/{docsEndpoint.slug}</span></p>
                              <p><strong className="text-gray-300">Method:</strong> <span className="text-green-400">{docsEndpoint.method}</span></p>
                              <p><strong className="text-gray-300">Fields:</strong></p>
                              <ul className="list-disc pl-6 text-gray-300">
                                   {docsEndpoint.fields.map(field => (
                                        <li key={field.fieldName}>
                                             <strong>{field.fieldName}</strong> ({field.type}) {field.required ? "(required)" : "(optional)"}
                                        </li>
                                   ))}
                              </ul>
                              <div className="mt-4 flex justify-end">
                                   <Button onClick={() => setShowDocs(false)} variant="secondary">Close</Button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
