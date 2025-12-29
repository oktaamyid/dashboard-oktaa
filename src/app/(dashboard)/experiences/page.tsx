"use client";

import { useEffect, useState } from "react";
import Table from "@/components/ui/table";
import { getExperiences, createExperience, updateExperience, deleteExperience } from "@/lib/service";
import { Experience } from "@/app/types";
import { formatArrayCell } from "@/lib/utils/formatArray";
import Button from "@/components/ui/button";
import ExperienceForm from "@/components/features/experiences/experienceForm";
import { useToast } from "@/components/ui/toast";
import Skeleton from "react-loading-skeleton";

export default function Experiences() {
     const { showSuccess, showError } = useToast();
     const [data, setData] = useState<Experience[]>([]);
     const [loading, setLoading] = useState(true);
     const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
     const [showForm, setShowForm] = useState(false);

     useEffect(() => {
          async function fetchData() {
               try {
                    setLoading(true);
                    const experiences = await getExperiences();
                    setData(experiences);
               } catch (error) {
                    console.error("Error fetching data: ", error);
               } finally {
                    setLoading(false);
               }
          }

          fetchData();
     }, []);

     const handleSubmit = async (formData: Omit<Experience, 'id'>) => {
          try {
               if (editingExperience) {
                    await updateExperience(editingExperience.id, formData);
                    setData(data.map((item) => (item.id === editingExperience.id ? { ...item, ...formData } : item)));
                    setEditingExperience(null);
                    setShowForm(false);
               } else {
                    const newId = await createExperience(formData);
                    setData([...data, { id: newId, ...formData }]);
                    setShowForm(false);
               }
          } catch (error) {
               throw error;
          }
     };

     const handleEdit = (experience: Experience) => {
          setEditingExperience(experience);
          setShowForm(true);
     };

     const handleDelete = async (id: string) => {
          try {
               await deleteExperience(id);
               setData(data.filter((item) => item.id !== id));
               showSuccess("Experience deleted successfully");
          } catch (error) {
               showError("Failed to delete experience");
               console.error("Error deleting experience: ", error);
          }
     };

     const handleCancel = () => {
          setEditingExperience(null);
          setShowForm(false);
     };

     if (loading) {
          return (
               <div className="space-y-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Experiences</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading data...</p>
                    </div>
                    <Skeleton height={40} className="mb-4" />
                    <Skeleton count={5} height={60} className="mb-2" />
               </div>
          );
     }

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Experiences</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Professional History</p>
                    </div>
                    {!showForm && (
                         <Button
                              onClick={() => setShowForm(true)}
                              variant="primary"
                              size="sm"
                         >
                              New Experience
                         </Button>
                    )}
               </div>

               {showForm && (
                    <div className="bg-black border border-white/10 p-6 animate-in fade-in slide-in-from-top-4">
                         <ExperienceForm
                              initialData={editingExperience || undefined}
                              onSubmit={handleSubmit}
                              onCancel={handleCancel}
                         />
                    </div>
               )}

               <div className="border border-white/10 rounded-none overflow-hidden">
                    <Table
                         data={data}
                         columns={["company", "role", "year", "actions"]}
                         isLoading={loading}
                         renderCell={(column, row) => {
                              if (column === "actions") {
                                   return (
                                        <div className="flex space-x-2">
                                             <Button
                                                  variant="secondary"
                                                  onClick={() => handleEdit(row)}
                                                  className="px-2 py-1"
                                             >
                                                  Edit
                                             </Button>
                                             <Button
                                                  variant="danger"
                                                  onClick={() => {
                                                       if (confirm("Delete this experience?")) {
                                                            handleDelete(row.id);
                                                       }
                                                  }}
                                                  className="px-2 py-1"
                                             >
                                                  Delete
                                             </Button>
                                        </div>
                                   );
                              }
                              if (column == "techStack") return formatArrayCell(row[column]);
                              return row[column as keyof Experience] as React.ReactNode;
                         }}
                    />
               </div>
          </div>
     );
}