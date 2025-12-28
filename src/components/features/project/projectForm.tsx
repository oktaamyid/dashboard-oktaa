"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Project } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ImageUploader from "@/components/ui/imageUpload";
import FormWrapper from "@/components/ui/form-wrapper";
import { useToast } from "@/components/ui/toast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { uploadImage, deleteImage } from "@/lib/service";
import { projectSchema, ProjectFormData } from "@/lib/schemas";

interface ProjectFormProps {
     initialData?: Project;
     onSubmit: (data: Omit<Project, "id">) => Promise<void>;
     onCancel?: () => void;
}

export default function ProjectForm({ initialData, onSubmit, onCancel }: ProjectFormProps) {
     const { showSuccess, showError } = useToast();
     const [uploadProgress, setUploadProgress] = useState(0);
     const [techInput, setTechInput] = useState("");

     const {
          register,
          handleSubmit,
          setValue,
          watch,
          formState: { errors, isSubmitting },
     } = useForm<ProjectFormData>({
          resolver: zodResolver(projectSchema),
          defaultValues: {
               title: initialData?.title || "",
               type: initialData?.type || "Website",
               year: initialData?.year || new Date().getFullYear().toString(),
               image: initialData?.image || "",
               description: initialData?.description || "",
               description_id: initialData?.description_id || "",
               link: initialData?.link || "",
               technology: initialData?.technology || [],
          },
     });

     const technology = watch("technology") || [];
     const image = watch("image");

     const handleFileChange = async (file: File) => {
          if (!file.type.startsWith("image/")) {
               showError("Please upload an image file");
               return;
          }
          if (file.size > 5 * 1024 * 1024) {
               showError("File size is too large (maximum 5MB)");
               return;
          }

          const interval = setInterval(() => {
               setUploadProgress((prev) => (prev >= 95 ? 95 : prev + 5));
          }, 100);

          try {
               const { url } = await uploadImage(file);
               setValue("image", url, { shouldDirty: true });
               showSuccess("Image uploaded successfully");
          } catch (error) {
               console.error(error);
               showError("Failed to upload image");
          } finally {
               clearInterval(interval);
               setUploadProgress(0);
          }
     };

     const handleRemoveImage = async () => {
          if (image && image !== initialData?.image) {
               try {
                    await deleteImage(image);
               } catch (err) {
                    console.error("Failed to delete temp image", err);
               }
          }
          setValue("image", "");
     };

     const addTechnology = (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === ",") {
               e.preventDefault();
               const newTech = techInput.trim();
               if (newTech && !technology.includes(newTech)) {
                    setValue("technology", [...technology, newTech], { shouldValidate: true });
                    setTechInput("");
               }
          }
     };

     const removeTechnology = (tech: string) => {
          setValue("technology", technology.filter((t) => t !== tech), { shouldValidate: true });
     };

     const onFormSubmit = async (data: ProjectFormData) => {
          try {
               await onSubmit({
                    ...data,
                    image: data.image || "",
                    link: data.link || "",
                    description_id: data.description_id || ""
               });
               showSuccess("Project saved successfully");
          } catch (error) {
               console.error(error);
               showError("Failed to save project");
          }
     };

     return (
          <FormWrapper
               title={initialData ? "Edit Project" : "Initiate New Project"}
               description={initialData ? "Modify existing project details" : "Add a new project to your portfolio"}
          >
               <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                              <Input
                                   label="Project Title"
                                   {...register("title")}
                                   error={errors.title?.message}
                                   placeholder="e.g. Neo-Tokyo Dashboard"
                              />

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2 block">
                                             Type
                                        </label>
                                        <select
                                             {...register("type")}
                                             className="w-full bg-black border border-white/10 rounded-none p-3 text-white text-sm focus:outline-none focus:border-white/30"
                                        >
                                             <option value="Website">Website</option>
                                             <option value="Mobile">Mobile</option>
                                             <option value="Other">Other</option>
                                        </select>
                                        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                                   </div>
                                   <Input
                                        label="Year"
                                        {...register("year")}
                                        error={errors.year?.message}
                                        placeholder="e.g. 2025"
                                   />
                              </div>

                              <Input
                                   label="Project URL"
                                   {...register("link")}
                                   error={errors.link?.message}
                                   placeholder="https://..."
                              />

                              <div>
                                   <Input
                                        label="Tech Stack (Press Enter)"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={addTechnology}
                                        placeholder="Type and press Enter..."
                                        error={errors.technology?.message}
                                   />
                                   <div className="mt-3 flex flex-wrap gap-2">
                                        {technology.map((tech) => (
                                             <span
                                                  key={tech}
                                                  className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 text-white text-[10px] uppercase font-bold tracking-wider group"
                                             >
                                                  {tech}
                                                  <button
                                                       type="button"
                                                       onClick={() => removeTechnology(tech)}
                                                       className="ml-2 text-zinc-500 group-hover:text-red-500 transition-colors"
                                                  >
                                                       <XMarkIcon className="w-3 h-3" />
                                                  </button>
                                             </span>
                                        ))}
                                   </div>
                              </div>
                         </div>

                         <div>
                              <div className="mb-2 block">
                                   <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                        Project Thumbnail
                                   </label>
                              </div>
                              <ImageUploader
                                   previewImage={image || null}
                                   onFileChange={handleFileChange}
                                   onRemoveImage={handleRemoveImage}
                              />
                              {uploadProgress > 0 && (
                                   <div className="mt-2 text-right">
                                        <span className="text-xs text-zinc-500">Uploading... {uploadProgress}%</span>
                                   </div>
                              )}
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Input
                              label="Description (EN)"
                              {...register("description")}
                              error={errors.description?.message}
                              placeholder="Short description in English..."
                         />
                         <Input
                              label="Description (ID)"
                              {...register("description_id")}
                              error={errors.description_id?.message}
                              placeholder="Deskripsi singkat dalam Bahasa Indonesia..."
                         />
                    </div>

                    <div className="flex justify-end space-x-4 pt-8 border-t border-white/10">
                         {onCancel && (
                              <Button type="button" variant="secondary" onClick={onCancel}>
                                   Cancel
                              </Button>
                         )}
                         <Button type="submit" variant="primary" disabled={isSubmitting}>
                              {isSubmitting ? "Saving..." : initialData ? "Update Project" : "Save Project"}
                         </Button>
                    </div>
               </form>
          </FormWrapper>
     );
}
