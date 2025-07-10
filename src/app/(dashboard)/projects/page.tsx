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
               <div className="p-6 min-h-screen">
                    <h1 className="text-2xl font-bold text-white mb-6">Manage Projects</h1>
                    <Skeleton height={40} width="50%" className="mb-4" />
                    <Skeleton count={5} height={60} className="mb-2" />
               </div>
          );
     }

     return (
          <div>
               <h1 className="text-2xl font-bold text-white mb-6">Manage Projects</h1>
               {!showForm && (
                    <div className="mb-6">
                         <Button
                              onClick={() => setShowForm(true)}
                              className="bg-blue-600 text-white hover:bg-blue-700"
                         >
                              Add New Project
                         </Button>
                    </div>
               )}

               {showForm && (
                    <ProjectForm
                         initialData={editingProject || undefined}
                         onSubmit={handleSubmit}
                         onCancel={handleCancel}
                    />
               )}
               <ProjectTable
                    projects={projects}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={loading}
               />
          </div>
     );
}