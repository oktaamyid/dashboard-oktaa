"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Toggle from "@/components/ui/toggle";
import CategorySelect from "@/components/ui/categorySelect";
import FormWrapper from "@/components/ui/form-wrapper";
import { useToast } from "@/components/ui/toast";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { linkSchema, LinkFormData } from "@/lib/schemas";
import { useState } from "react";

interface LinkFormProps {
     initialData?: Link;
     onSubmit: (data: Omit<Link, "id">) => Promise<void>;
     onCancel: () => void;
}

export default function LinkForm({ initialData, onSubmit, onCancel }: LinkFormProps) {
     const { showSuccess, showError } = useToast();
     const [newUrl, setNewUrl] = useState("");
     const [newUrlName, setNewUrlName] = useState("");
     const [editingUrlIndex, setEditingUrlIndex] = useState<number | null>(null);

     const {
          register,
          control,
          handleSubmit,
          watch,
          setValue,
          formState: { errors, isSubmitting },
     } = useForm<LinkFormData>({
          resolver: zodResolver(linkSchema),
          defaultValues: {
               originalUrl: initialData?.originalUrl || undefined,
               shortUrl: initialData?.shortUrl || "",
               description: initialData?.description || "",
               isPinned: initialData?.isPinned || false,
               showToPortal: initialData?.showToPortal || false,
               category: initialData?.category || "",
               price: initialData?.price || 0,
               nameUrl: initialData?.nameUrl || "",
               useMultipleUrls: initialData?.useMultipleUrls || false,
               multipleUrls: initialData?.multipleUrls || [],
               showConfirmationPage: initialData?.showConfirmationPage || false,
               confirmationPageSettings: {
                    customMessage: initialData?.confirmationPageSettings?.customMessage || "",
               },
          } as any
     });

     const { fields, append, update, remove } = useFieldArray({
          control,
          name: "multipleUrls",
     });

     const useMultipleUrls = watch("useMultipleUrls");
     const showToPortal = watch("showToPortal");
     const showConfirmationPage = watch("showConfirmationPage");

     const onAddOrUpdateUrl = () => {
          if (!newUrl) return;

          if (editingUrlIndex !== null) {
               update(editingUrlIndex, { url: newUrl, name: newUrlName });
               setEditingUrlIndex(null);
          } else {
               append({ url: newUrl, name: newUrlName });
          }
          setNewUrl("");
          setNewUrlName("");
     };

     const onEditUrl = (index: number) => {
          const item = fields[index];
          setNewUrl(item.url);
          setNewUrlName(item.name || "");
          setEditingUrlIndex(index);
     };

     const onRemoveUrl = (index: number) => {
          remove(index);
          if (editingUrlIndex === index) {
               setNewUrl("");
               setNewUrlName("");
               setEditingUrlIndex(null);
          }
          showSuccess("URL removed");
     };

     const onFormSubmit = async (data: LinkFormData) => {
          try {
               // Logic for originalUrl vs multipleUrls based on toggle
               const finalData: Omit<Link, "id"> = {
                    ...data,
                    originalUrl: data.useMultipleUrls && data.multipleUrls && data.multipleUrls.length > 0
                         ? data.multipleUrls[0].url
                         : data.originalUrl || "",
                    // Ensure optional fields are handled correctly
                    category: data.category || "",
                    nameUrl: data.nameUrl || "",
                    description: data.description || "",
                    price: data.price || 0,
                    confirmationPageSettings: data.confirmationPageSettings || { customMessage: "" },
               };

               await onSubmit(finalData);
               showSuccess(initialData ? "Link updated successfully" : "Link created successfully");
          } catch (error) {
               console.error(error);
               showError("Failed to save link");
          }
     };

     return (
          <FormWrapper
               title={initialData ? "Edit Link Sequence" : "Initialize New Link"}
               description="Manage redirection rules and portal visibility"
          >
               <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <Input
                              label="Short Slug"
                              {...register("shortUrl")}
                              error={errors.shortUrl?.message}
                              placeholder="e.g. my-link"
                         />

                         <Input
                              label="Destination URL"
                              {...register("originalUrl")}
                              error={errors.originalUrl?.message}
                              disabled={useMultipleUrls}
                              placeholder={useMultipleUrls ? "Disabled (Using Multiple URLs)" : "https://..."}
                         />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-6 pt-4">
                         <div className="flex flex-wrap gap-4">
                              <Toggle
                                   checked={showToPortal}
                                   onChange={(val) => setValue("showToPortal", val)}
                                   label="Display on Portal"
                                   variant="success"
                                   size="md"
                              />
                              <Toggle
                                   checked={useMultipleUrls}
                                   onChange={(val) => {
                                        setValue("useMultipleUrls", val);
                                        if (val) setValue("showToPortal", true); // Auto-enable portal if multiple
                                   }}
                                   label="Use Multi-Link Rotation"
                                   variant="warning"
                                   size="md"
                              />
                              <Toggle
                                   checked={watch("isPinned")}
                                   onChange={(val) => setValue("isPinned", val)}
                                   label="Pin to Top"
                                   variant="default"
                                   size="md"
                              />
                         </div>
                    </div>

                    {/* Portal Details Section */}
                    {showToPortal && (
                         <div className="pt-8 border-t border-white/10 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-4">
                                   <span>Portal Details</span>
                                   <div className="h-px bg-white/10 flex-1"></div>
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <Input
                                        label="Display Name"
                                        {...register("nameUrl")}
                                        placeholder="Link Name"
                                   />
                                   <CategorySelect
                                        label="Category"
                                        value={watch("category") || ""}
                                        onChange={(val) => setValue("category", val)}
                                   />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <div className="md:col-span-2">
                                        <Input
                                             label="Brief Description"
                                             {...register("description")}
                                             placeholder="Optional description..."
                                        />
                                   </div>
                                   <div>
                                        <Input
                                             label="Price Value"
                                             type="number"
                                             step="0.01"
                                             {...register("price", { valueAsNumber: true })}
                                        />
                                   </div>
                              </div>

                              {/* Multiple URLs Section */}
                              {useMultipleUrls && (
                                   <div className="space-y-4 pt-4">
                                        <label className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block">Rotation URLs</label>

                                        <div className="bg-white/5 border border-white/10 p-4 space-y-4">
                                             <div className="flex flex-col md:flex-row gap-4 items-end">
                                                  <div className="w-full">
                                                       <label className="text-xs text-zinc-400 mb-1 block">Target URL</label>
                                                       <input
                                                            className="w-full bg-black border border-white/20 px-3 py-2 text-white focus:outline-none focus:border-white/50 text-sm"
                                                            value={newUrl}
                                                            onChange={(e) => setNewUrl(e.target.value)}
                                                            placeholder="https://..."
                                                       />
                                                  </div>
                                                  <div className="w-full">
                                                       <label className="text-xs text-zinc-400 mb-1 block">Label (Optional)</label>
                                                       <input
                                                            className="w-full bg-black border border-white/20 px-3 py-2 text-white focus:outline-none focus:border-white/50 text-sm"
                                                            value={newUrlName}
                                                            onChange={(e) => setNewUrlName(e.target.value)}
                                                            placeholder="Label"
                                                       />
                                                  </div>
                                                  <Button
                                                       type="button"
                                                       variant="primary"
                                                       onClick={onAddOrUpdateUrl}
                                                       disabled={!newUrl}
                                                       className="mb-px"
                                                  >
                                                       {editingUrlIndex !== null ? <PencilIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                                                  </Button>
                                             </div>

                                             {errors.multipleUrls && (
                                                  <p className="text-red-500 text-xs mt-1">{errors.multipleUrls.message}</p>
                                             )}

                                             <div className="space-y-1 mt-4">
                                                  {fields.map((field, index) => (
                                                       <div key={field.id} className="flex items-center justify-between text-zinc-300 text-sm bg-black border border-white/10 p-3 hover:border-white/30 transition-colors">
                                                            <div className="flex flex-col">
                                                                 <span className="font-bold text-white">{field.name || "Untitled Link"}</span>
                                                                 <span className="text-[10px] font-mono text-zinc-500 truncate max-w-md">{field.url}</span>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => onEditUrl(index)}
                                                                      className="btn btn-square btn-xs btn-ghost text-zinc-400 hover:text-white"
                                                                 >
                                                                      <PencilIcon className="w-4 h-4" />
                                                                 </button>
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => remove(index)}
                                                                      className="btn btn-square btn-xs btn-ghost text-zinc-400 hover:text-red-500"
                                                                 >
                                                                      <TrashIcon className="w-4 h-4" />
                                                                 </button>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>
                              )}
                         </div>
                    )}

                    {/* Confirmation Page Section */}
                    <div className="border-t border-white/10 pt-6">
                         <Toggle
                              checked={showConfirmationPage}
                              onChange={(val) => setValue("showConfirmationPage", val)}
                              label="Enable Interstitial Confirmation Page"
                              variant="default"
                              size="md"
                         />

                         {showConfirmationPage && (
                              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                   <Input
                                        label="Custom Interstitial Message"
                                        {...register("confirmationPageSettings.customMessage")}
                                        placeholder="e.g. 'You are leaving our site...'"
                                   />
                              </div>
                         )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-white/10">
                         <Button
                              type="button"
                              variant="secondary"
                              onClick={onCancel}
                              disabled={isSubmitting}
                         >
                              Cancel
                         </Button>
                         <Button
                              type="submit"
                              disabled={isSubmitting}
                              variant="primary"
                         >
                              {isSubmitting ? "Processing..." : initialData ? "Save Changes" : "Create Link"}
                         </Button>
                    </div>
               </form>
          </FormWrapper>
     );
}