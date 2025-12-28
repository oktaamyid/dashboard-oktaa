"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import FormWrapper from "@/components/ui/form-wrapper";
import { useToast } from "@/components/ui/toast";
import { apiEndpointSchema, ApiEndpointFormData } from "@/lib/schemas";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ApiEndpoint } from "@/app/types";

interface ApiBuilderFormProps {
     initialData?: ApiEndpoint;
     onSubmit: (data: ApiEndpoint, isEdit: boolean) => Promise<void>;
     onCancel: () => void;
}

export default function ApiBuilderForm({ initialData, onSubmit, onCancel }: ApiBuilderFormProps) {
     const { showSuccess, showError } = useToast();

     const {
          register,
          control,
          handleSubmit,
          formState: { errors, isSubmitting },
     } = useForm<ApiEndpointFormData>({
          resolver: zodResolver(apiEndpointSchema),
          defaultValues: {
               name: initialData?.name || "",
               slug: initialData?.slug || "",
               method: (initialData?.method as "GET" | "POST") || "GET",
               fields: initialData?.fields?.map(f => ({
                    fieldName: f.fieldName,
                    type: f.type as "text" | "number" | "boolean" | "date",
                    required: f.required,
                    defaultValue: f.defaultValue
               })) || []
          } as any,
     });

     const { fields, append, remove } = useFieldArray({
          control,
          name: "fields",
     });

     const onFormSubmit = async (data: ApiEndpointFormData) => {
          try {
               // Map form data to ApiEndpoint structure
               // We need to preserve ID if it exists (for edits) or let backend handle it
               // The parent handles the ID logic typically, but here we construct the object
               const apiData: ApiEndpoint = {
                    id: initialData?.id || "", // ID is required by type, preserve if exists
                    slug: data.slug,
                    method: data.method,
                    name: data.name,
                    fields: data.fields.map(f => ({
                         fieldName: f.fieldName,
                         type: f.type,
                         required: f.required,
                         defaultValue: f.defaultValue ?? null // Convert undefined to null if needed
                    }))
               };

               await onSubmit(apiData, !!initialData);
               // Success message handled by parent based on promise, but we can show one here too or removing it to avoid double toast
               // Parent checks isEdit to show "Updated" vs "Created"
          } catch (error) {
               console.error(error);
               showError("Failed to save endpoint");
          }
     };

     return (
          <FormWrapper
               title={initialData ? "Edit Endpoint" : "Create Endpoint"}
               description="Define your visual API schema"
          >
               <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-1">
                              <Select
                                   label="HTTP Method"
                                   {...register("method")}
                                   options={[
                                        { value: "GET", label: "GET (Fetch Data)" },
                                        { value: "POST", label: "POST (Submit Data)" }
                                   ]}
                              />
                              {errors.method && <p className="text-red-500 text-xs mt-1">{errors.method.message}</p>}
                         </div>
                         <div className="md:col-span-2">
                              <Input
                                   label="Endpoint Slug"
                                   {...register("slug")}
                                   error={errors.slug?.message}
                                   placeholder="e.g. users"
                              />
                         </div>
                    </div>

                    <Input
                         label="Description / Name"
                         {...register("name")}
                         error={errors.name?.message}
                         placeholder="e.g. Get All Active Users"
                    />

                    {/* Fields Builder */}
                    <div className="pt-6 border-t border-white/10">
                         <div className="flex justify-between items-center mb-6">
                              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Schema Fields</h3>
                              <Button
                                   type="button"
                                   variant="primary"
                                   size="sm"
                                   onClick={() => append({ fieldName: "", type: "text", required: false })}
                              >
                                   <PlusIcon className="w-4 h-4 mr-2" /> Add Field
                              </Button>
                         </div>

                         {fields.length === 0 && (
                              <div className="text-center py-8 border border-dashed border-white/10 bg-white/5">
                                   <p className="text-zinc-500 text-sm">No fields defined. This endpoint will return/accept raw data.</p>
                              </div>
                         )}

                         <div className="space-y-3">
                              {fields.map((field, index) => (
                                   <div key={field.id} className="grid grid-cols-12 gap-4 items-start bg-black border border-white/10 p-4 animate-in fade-in slide-in-from-left-2">
                                        <div className="col-span-4">
                                             <Input
                                                  label={index === 0 ? "Field Name" : undefined}
                                                  {...register(`fields.${index}.fieldName`)}
                                                  error={errors.fields?.[index]?.fieldName?.message}
                                                  placeholder="key_name"
                                                  className="h-9"
                                             />
                                        </div>
                                        <div className="col-span-3">
                                             <Select
                                                  label={index === 0 ? "Data Type" : undefined}
                                                  {...register(`fields.${index}.type`)}
                                                  options={[
                                                       { value: "text", label: "Text String" },
                                                       { value: "number", label: "Number" },
                                                       { value: "boolean", label: "Boolean" },
                                                       { value: "date", label: "Date/Time" },
                                                  ]}
                                                  className="h-9"
                                             />
                                        </div>
                                        <div className="col-span-4 pt-1">
                                             {index === 0 && <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Options</label>}
                                             <div className="flex items-center space-x-4 h-9">
                                                  <label className="flex items-center gap-2 cursor-pointer">
                                                       <input
                                                            type="checkbox"
                                                            {...register(`fields.${index}.required`)}
                                                            className="w-4 h-4 rounded border-white/20 bg-black text-white focus:ring-0 checked:bg-white"
                                                       />
                                                       <span className="text-xs text-zinc-300 uppercase font-bold tracking-wider">Req</span>
                                                  </label>
                                             </div>
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                             <button
                                                  type="button"
                                                  onClick={() => remove(index)}
                                                  className={`text-zinc-500 hover:text-red-500 transition-colors ${index === 0 ? 'mt-7' : 'mt-2'}`}
                                             >
                                                  <TrashIcon className="w-5 h-5" />
                                             </button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
                         <Button type="button" variant="secondary" onClick={onCancel}>
                              Cancel
                         </Button>
                         <Button type="submit" disabled={isSubmitting} variant="primary">
                              {isSubmitting ? "Saving Endpoint..." : initialData ? "Update Endpoint" : "Create Endpoint"}
                         </Button>
                    </div>
               </form>
          </FormWrapper>
     );
}
