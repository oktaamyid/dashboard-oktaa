"use client";

import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import ProjectForm from '@/components/features/project/projectForm';
import ProjectTable from '@/components/features/project/projectTable';
import { Project } from '@/app/types';
import Button from '@/components/ui/button';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/service';
import { useToast } from '@/components/ui/toast';

export default function ProjectsPage() {
     const { showSuccess, showError } = useToast();
     const [projects, setProjects] = useState<Project[]>([]);
     const [loading, setLoading] = useState(true);
     const [editingProject, setEditingProject] = useState<Project | null>(null);
     const [showForm, setShowForm] = useState(false);

     useEffect(() => {
          const fetchProjects = async () => {
               try {
                    const fetchedProjects = await getProjects();
                    setProjects(fetchedProjects);
               } catch (error) {
                    console.error('Error fetching projects:', error);
               } finally {
                    setLoading(false);
               }
          };
          fetchProjects();
     }, []);

     const handleSubmit = async (data: Omit<Project, 'id'>) => {
          try {
               if (editingProject) {
                    await updateProject(editingProject.id, data);
                    setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...data } : p)));
                    setEditingProject(null);
                    setShowForm(false);
               } else {
                    const newProjectId = await createProject(data);
                    setProjects([...projects, { id: newProjectId, ...data }]);
                    setShowForm(false);
               }
          } catch (error) {
               throw error; // Ditangani oleh ProjectForm
          }
     };

     const handleEdit = (project: Project) => {
          setEditingProject(project);
          setShowForm(true);
     };

     const handleDelete = async (id: string) => {
          try {
               await deleteProject(id);
               setProjects(projects.filter((p) => p.id !== id));
               showSuccess("Project deleted successfully");
          } catch (error) {
               showError("Failed to delete project");
               console.error('Error deleting project:', error);
          }
     };

     const handleCancel = () => {
          setEditingProject(null);
          setShowForm(false);
     };

     if (loading) {
          return (
               <div className="space-y-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Projects</h1>
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
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Projects</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Manage Portfolio Items</p>
                    </div>
                    {!showForm && (
                         <Button
                              onClick={() => setShowForm(true)}
                              variant="primary"
                              size="sm"
                         >
                              New Project
                         </Button>
                    )}
               </div>

               {showForm && (
                    <div className="bg-black border border-white/10 p-6 animate-in fade-in slide-in-from-top-4">
                         <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                         <ProjectForm
                              initialData={editingProject || undefined}
                              onSubmit={handleSubmit}
                              onCancel={handleCancel}
                         />
                    </div>
               )}

               <div className="border border-white/10 rounded-none overflow-hidden">
                    <ProjectTable
                         projects={projects}
                         onEdit={handleEdit}
                         onDelete={handleDelete}
                         isLoading={loading}
                    />
               </div>
          </div>
     );
}