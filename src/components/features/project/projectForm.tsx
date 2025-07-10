"use client";

import { useState, useEffect } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import ImageUploader from '@/components/ui/imageUpload';
import { Project } from '@/app/types';
import { uploadImage, deleteImage } from '@/lib/service';
import { useToast } from '@/components/ui/toast';

interface ProjectFormProps {
     initialData?: Project;
     onSubmit: (data: Omit<Project, 'id'>) => Promise<void>;
     onCancel?: () => void;
}

export default function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
     const { showSuccess, showError } = useToast();
     const [formData, setFormData] = useState<Omit<Project, 'id'>>({
          title: initialData?.title || '',
          image: initialData?.image || '',
          description: initialData?.description || '',
          link: initialData?.link || '',
          technology: initialData?.technology || [],
     });
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);
     const [selectedFile, setSelectedFile] = useState<File | null>(null);
     const [uploadProgress, setUploadProgress] = useState<number>(0);
     const [technologyInput, setTechnologyInput] = useState<string>(initialData?.technology.join(', ') || '');

     useEffect(() => {
          if (initialData) {
               setFormData({
                    title: initialData.title,
                    image: initialData.image,
                    description: initialData.description,
                    link: initialData.link,
                    technology: initialData.technology,
               });
               setPreviewImage(initialData.image || null);
               setTechnologyInput(initialData.technology.join(', '));
          }
     }, [initialData]);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData((prev) => ({ ...prev, [name]: value }));
     };

     const handleFileChange = (file: File) => {
          if (!file.type.startsWith('image/')) {
               showError('Please upload an image file');
               return;
          }
          if (file.size > 5 * 1024 * 1024) {
               showError('File size is too large (maximum 5MB)');
               return;
          }

          setSelectedFile(file);
          const reader = new FileReader();
          reader.onload = () => {
               setPreviewImage(reader.result as string);
               console.log('Preview image set:', reader.result);
          };
          reader.readAsDataURL(file);
     };

     const handleRemoveImage = async () => {
          if (formData.image && initialData?.image === formData.image) {
               try {
                    await deleteImage(formData.image);
               } catch (error) {
                    console.error('Failed to delete image from R2:', error);
                    showError('Failed to delete image');
               }
          }
          setPreviewImage(null);
          setSelectedFile(null);
          setFormData((prev) => ({ ...prev, image: '' }));
     };

     const handleTechnologyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          setTechnologyInput(value);
          const technologies = value
               .split(/[, ]+/)
               .map((tech) => tech.trim())
               .filter((tech) => tech !== '');
          setFormData((prev) => ({ ...prev, technology: technologies }));
     };

     const handleRemoveTechnology = (techToRemove: string) => {
          const updatedTechnologies = formData.technology.filter((tech) => tech !== techToRemove);
          setFormData((prev) => ({ ...prev, technology: updatedTechnologies }));
          setTechnologyInput(updatedTechnologies.join(', '));
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);
          setUploadProgress(0);

          if (!formData.title || !formData.description) {
               showError('Title and description are required');
               setIsSubmitting(false);
               return;
          }

          if (formData.technology.length === 0) {
               showError('At least one technology is required');
               setIsSubmitting(false);
               return;
          }

          try {
               let imageUrl = formData.image;

               if (selectedFile) {
                    const progressInterval = setInterval(() => {
                         setUploadProgress((prev) => {
                              if (prev >= 95) {
                                   clearInterval(progressInterval);
                                   return 95;
                              }
                              return prev + 5;
                         });
                    }, 100);

                    const { url } = await uploadImage(selectedFile);
                    imageUrl = url;

                    clearInterval(progressInterval);
                    setUploadProgress(100);
               }

               const projectData = { ...formData, image: imageUrl };
               try {
                    await onSubmit(projectData);
               } catch (error) {
                    if (imageUrl && imageUrl !== initialData?.image) {
                         await deleteImage(imageUrl);
                    }
                    throw error;
               }

               showSuccess('Project saved successfully');
               if (!initialData) {
                    setFormData({ title: '', image: '', description: '', link: '', technology: [] });
                    setPreviewImage(null);
                    setSelectedFile(null);
                    setTechnologyInput('');
               }
          } catch (error) {
               showError('Failed to save project');
               console.error(error);
          } finally {
               setIsSubmitting(false);
          }
     };

     const handleCancel = () => {
          setPreviewImage(null);
          setSelectedFile(null);
          if (onCancel) onCancel();
     };

     return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mx-auto">
               <h2 className="text-xl font-semibold text-white mb-6">{initialData ? 'Edit Project' : 'Add Project'}</h2>

               <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-4">
                              <Input
                                   label="Title"
                                   name="title"
                                   required
                                   value={formData.title}
                                   onChange={handleChange}
                                   className="bg-gray-700 text-gray-300 border-gray-600"
                              />

                              <Input
                                   label="Link"
                                   name="link"
                                   type="url"
                                   value={formData.link}
                                   onChange={handleChange}
                                   className="bg-gray-700 text-gray-300 border-gray-600"
                              />
                              <div>
                                   <Input
                                        label="Technologies"
                                        name="technology"
                                        value={technologyInput}
                                        onChange={handleTechnologyChange}
                                        placeholder="Enter technologies separated by commas or spaces (e.g., React, TypeScript)"
                                        className="bg-gray-700 text-gray-300 border-gray-600"
                                   />
                                   {formData.technology.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                             {formData.technology.map((tech) => (
                                                  <span
                                                       key={tech}
                                                       className="inline-flex items-center px-2 py-1 bg-gray-600 text-gray-300 text-sm rounded-full"
                                                  >
                                                       {tech}
                                                       <button
                                                            type="button"
                                                            onClick={() => handleRemoveTechnology(tech)}
                                                            className="ml-2 text-gray-400 hover:text-red-400"
                                                       >
                                                            &times;
                                                       </button>
                                                  </span>
                                             ))}
                                        </div>
                                   )}
                              </div>
                         </div>
                         <div>
                              <ImageUploader
                                   previewImage={previewImage}
                                   onFileChange={handleFileChange}
                                   onRemoveImage={handleRemoveImage}
                              />
                              {isSubmitting && previewImage && previewImage !== initialData?.image && (
                                   <div className="mt-2">
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                             <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Uploading image: {uploadProgress}%</p>
                                   </div>
                              )}
                         </div>
                    </div>

                    <Input
                         label="Description"
                         name="description"
                         required
                         value={formData.description}
                         onChange={handleChange}
                         className="bg-gray-700 text-gray-300 border-gray-600"
                    />

                    <div className="flex space-x-4">
                         <Button
                              type="submit"
                              disabled={isSubmitting}
                              variant="primary"
                         >
                              {isSubmitting
                                   ? 'Saving...'
                                   : initialData
                                        ? 'Update Project'
                                        : 'Save Project'
                              }

                         </Button>
                         {onCancel && (
                              <Button
                                   type="button"
                                   variant="danger"
                                   onClick={handleCancel}
                                   disabled={isSubmitting}
                              >
                                   Cancel
                              </Button>
                         )}
                    </div>
               </form>
          </div>
     );
}