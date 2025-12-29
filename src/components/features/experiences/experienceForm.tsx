"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Experience } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import FormWrapper from "@/components/ui/form-wrapper";
import { useToast } from "@/components/ui/toast";
import { experienceSchema, ExperienceFormData } from "@/lib/schemas";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ExperienceFormProps {
     initialData?: Experience;
     onSubmit: (data: Omit<Experience, "id">) => Promise<void>;
     onCancel?: () => void;
}

export default function ExperienceForm({ initialData, onSubmit, onCancel }: ExperienceFormProps) {
     const { showSuccess, showError } = useToast();
     const [techInput, setTechInput] = useState("");

     const {
          register,
          handleSubmit,
          setValue,
          watch,
          formState: { errors, isSubmitting },
     } = useForm<ExperienceFormData>({
          resolver: zodResolver(experienceSchema),
          defaultValues: {
               company: initialData?.company || "",
               role: initialData?.role || "",
               year: initialData?.year || "",
               description: initialData?.description || "",
               description_id: initialData?.description_id || "",
               logo: initialData?.logo || "",
               link: initialData?.link || "",
               techStack: initialData?.techStack || [],
          },
     });

     const techStack = watch("techStack") || [];

     const addTechStack = (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === ",") {
               e.preventDefault();
               const newTech = techInput.trim();
               if (newTech && !techStack.includes(newTech)) {
                    setValue("techStack", [...techStack, newTech], { shouldValidate: true });
                    setTechInput("");
               }
          }
     };

     const removeTechStack = (tech: string) => {
          setValue("techStack", techStack.filter((t) => t !== tech), { shouldValidate: true });
     };

     const onFormSubmit = async (data: ExperienceFormData) => {
          try {
               await onSubmit({
                    ...data,
                    logo: data.logo || "",
                    link: data.link || "",
                    techStack: data.techStack || []
               });
               showSuccess("Experience saved successfully");
          } catch (error) {
               console.error(error);
               showError("Failed to save experience");
          }
     };

     return (
          <FormWrapper
               title={initialData ? "Edit Experience" : "Add New Experience"}
               description={initialData ? "Update professional experience details" : "Add a new role to your background"}
          >
               <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                              <Input
                                   label="Company"
                                   {...register("company")}
                                   error={errors.company?.message}
                                   placeholder="e.g. Google"
                              />

                              <Input
                                   label="Role"
                                   {...register("role")}
                                   error={errors.role?.message}
                                   placeholder="e.g. Senior Software Engineer"
                              />

                              <Input
                                   label="Year"
                                   {...register("year")}
                                   error={errors.year?.message}
                                   placeholder="e.g. 2023 - Present"
                              />

                              <Input
                                   label="Company URL"
                                   {...register("link")}
                                   error={errors.link?.message}
                                   placeholder="https://..."
                              />
                         </div>

                         <div className="space-y-6">
                              <Input
                                   label="Description (EN)"
                                   {...register("description")}
                                   error={errors.description?.message}
                                   placeholder="Describe your impact and responsibilities..."
                              />

                              <Input
                                   label="Description (ID)"
                                   {...register("description_id")}
                                   error={errors.description_id?.message}
                                   placeholder="Deskripsikan dampak dan tanggung jawab anda..."
                              />

                              <div>
                                   <Input
                                        label="Tech Stack (Press Enter)"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={addTechStack}
                                        placeholder="Type and press Enter..."
                                        error={errors.techStack?.message}
                                   />
                                   <div className="mt-3 flex flex-wrap gap-2">
                                        {techStack.map((tech) => (
                                             <span
                                                  key={tech}
                                                  className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 text-white text-[10px] uppercase font-bold tracking-wider group"
                                             >
                                                  {tech}
                                                  <button
                                                       type="button"
                                                       onClick={() => removeTechStack(tech)}
                                                       className="ml-2 text-zinc-500 group-hover:text-red-500 transition-colors"
                                                  >
                                                       <XMarkIcon className="w-3 h-3" />
                                                  </button>
                                             </span>
                                        ))}
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-8 border-t border-white/10">
                         {onCancel && (
                              <Button type="button" variant="secondary" onClick={onCancel}>
                                   Cancel
                              </Button>
                         )}
                         <Button type="submit" variant="primary" disabled={isSubmitting}>
                              {isSubmitting ? "Saving..." : initialData ? "Update Experience" : "Save Experience"}
                         </Button>
                    </div>
               </form>
          </FormWrapper>
     );
}
