"use client";

import { useState } from "react";
import { Link } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Toggle from "@/components/ui/toggle";
import CategorySelect from "@/components/ui/categorySelect";
import { useToast } from "@/components/ui/toast";
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface LinkFormProps {
     initialData?: Link;
     onSubmit: (data: Omit<Link, "id">) => Promise<void>;
     onCancel: () => void;
}

export default function LinkForm({ initialData, onSubmit, onCancel }: LinkFormProps) {
     const { showSuccess, showError } = useToast();
     const [formData, setFormData] = useState<Omit<Link, "id">>({
          originalUrl:
               initialData?.useMultipleUrls && initialData?.multipleUrls && initialData.multipleUrls.length > 0
                    ? initialData.multipleUrls[0].url
                    : initialData?.originalUrl || "",
          shortUrl: initialData?.shortUrl || "",
          multipleUrls: initialData?.multipleUrls || [],
          useMultipleUrls: initialData?.useMultipleUrls || false,
          showToPortal: initialData?.showToPortal || false,
          isPinned: initialData?.isPinned || false,
          category: initialData?.category || "",
          nameUrl: initialData?.nameUrl || "",
          description: initialData?.description || "",
          price: initialData?.price || 0,
          showConfirmationPage: initialData?.showConfirmationPage || false,
          confirmationPageSettings: {
               customMessage: initialData?.confirmationPageSettings?.customMessage || "",
          },
     });
     const [newUrl, setNewUrl] = useState<string>("");
     const [newUrlName, setNewUrlName] = useState<string>("");
     const [editingIndex, setEditingIndex] = useState<number | null>(null);
     const [isSubmitting, setIsSubmitting] = useState(false);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value, type, checked } = e.target;

          setFormData((prev) => {
               if (name === "confirmationPageSettings.customMessage") {
                    return {
                         ...prev,
                         confirmationPageSettings: {
                              ...prev.confirmationPageSettings,
                              customMessage: value,
                         },
                    };
               }

               if (name === "useMultipleUrls") {
                    const isChecked = checked;
                    const newOriginalUrl =
                         isChecked && prev.multipleUrls && prev.multipleUrls.length > 0 ? prev.multipleUrls[0].url : "";
                    return {
                         ...prev,
                         useMultipleUrls: isChecked,
                         showToPortal: isChecked ? true : prev.showToPortal,
                         multipleUrls: isChecked ? prev.multipleUrls : [],
                         originalUrl: newOriginalUrl,
                    };
               }

               return {
                    ...prev,
                    [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
               };
          });
     };

     const addOrUpdateUrl = () => {
          if (!newUrl) {
               showError("Please enter a valid URL");
               return;
          }

          setFormData((prev) => {
               const updatedUrls = [...(prev.multipleUrls || [])];
               if (editingIndex !== null) {
                    updatedUrls[editingIndex] = { url: newUrl, name: newUrlName || undefined };
               } else {
                    updatedUrls.push({ url: newUrl, name: newUrlName || undefined });
               }
               const newOriginalUrl = prev.useMultipleUrls ? updatedUrls[0].url : prev.originalUrl;
               return {
                    ...prev,
                    multipleUrls: updatedUrls,
                    originalUrl: newOriginalUrl,
               };
          });
          setNewUrl("");
          setNewUrlName("");
          setEditingIndex(null);
          showSuccess(
               editingIndex !== null
                    ? `Link URL "${newUrl}" has been successfully updated`
                    : `New link URL "${newUrl}" has been successfully added to the list`
          );
     };


     const editUrl = (index: number) => {
          const urlObj = formData.multipleUrls?.[index];
          if (urlObj) {
               setNewUrl(urlObj.url);
               setNewUrlName(urlObj.name || "");
               setEditingIndex(index);
          }
     };

     const removeUrl = (index: number) => {
          setFormData((prev) => {
               const updatedUrls = prev.multipleUrls?.filter((_, i) => i !== index) || [];
               const newOriginalUrl = prev.useMultipleUrls && updatedUrls.length > 0 ? updatedUrls[0].url : "";
               return {
                    ...prev,
                    multipleUrls: updatedUrls,
                    originalUrl: newOriginalUrl,
               };
          });
          if (editingIndex === index) {
               setNewUrl("");
               setNewUrlName("");
               setEditingIndex(null);
          }
          showSuccess("URL removed");
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);

          if (!formData.shortUrl) {
               showError("Short URL is required");
               setIsSubmitting(false);
               return;
          }

          if (!formData.useMultipleUrls && !formData.originalUrl) {
               showError("Original URL is required when not using multiple URLs");
               setIsSubmitting(false);
               return;
          }

          if (formData.useMultipleUrls && (!formData.multipleUrls || formData.multipleUrls.length === 0)) {
               showError("Please add at least one URL when using multiple URLs");
               setIsSubmitting(false);
               return;
          }

          try {
               await onSubmit(formData);
               showSuccess(initialData ? "Link updated successfully" : "Link created successfully");
               if (!initialData) {
                    setFormData({
                         originalUrl: "",
                         shortUrl: "",
                         multipleUrls: [],
                         useMultipleUrls: false,
                         showToPortal: false,
                         category: "",
                         nameUrl: "",
                         description: "",
                         price: 0,
                         showConfirmationPage: false,
                         confirmationPageSettings: { customMessage: "" },
                    });
                    setNewUrl("");
                    setNewUrlName("");
                    setEditingIndex(null);
               }
          } catch (error) {
               showError("Failed to save link");
               console.error("Submit error:", error);
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold text-white mb-4">{initialData ? "Edit Link" : "Create New Link"}</h2>

               <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                         label="Original URL (leave empty if using multiple URLs)"
                         name="originalUrl"
                         type="url"
                         required={!formData.useMultipleUrls}
                         value={formData.originalUrl}
                         onChange={handleChange}
                         disabled={formData.useMultipleUrls}
                         placeholder={formData.useMultipleUrls ? "Automatically set from multiple URLs" : "Enter original URL"}
                    />

                    <Input
                         label="Short URL"
                         name="shortUrl"
                         type="text"
                         required
                         value={formData.shortUrl}
                         onChange={handleChange}
                    />

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">

                         <Toggle
                              checked={formData.showToPortal || formData.useMultipleUrls || false}
                              onChange={(isChecked) => {
                                   setFormData((prev) => {
                                        const newOriginalUrl =
                                             isChecked && prev.useMultipleUrls && (prev.multipleUrls ?? []).length > 0
                                                  ? (prev.multipleUrls ?? [])[0]?.url
                                                  : prev.originalUrl;
                                        return {
                                             ...prev,
                                             showToPortal: isChecked,
                                             useMultipleUrls: isChecked ? prev.useMultipleUrls : false,
                                             multipleUrls: isChecked ? prev.multipleUrls : [],
                                             originalUrl: newOriginalUrl,
                                        };
                                   });
                              }}
                              label="Show to Portal?"
                              variant="success"
                              size="md"
                         />

                         <Toggle
                              checked={formData.useMultipleUrls || false}
                              onChange={(isChecked) => {
                                   setFormData((prev) => {
                                        const newOriginalUrl =
                                             isChecked && prev.multipleUrls && prev.multipleUrls.length > 0 ? prev.multipleUrls[0].url : "";
                                        return {
                                             ...prev,
                                             useMultipleUrls: isChecked,
                                             showToPortal: isChecked ? true : prev.showToPortal,
                                             multipleUrls: isChecked ? prev.multipleUrls : [],
                                             originalUrl: newOriginalUrl,
                                        };
                                   });
                              }}
                              label="Use Multiple URLs (disables Original URL)"
                              variant="warning"
                              size="md"
                         />

                         <Toggle
                              checked={formData.isPinned || false}
                              onChange={(isChecked) => {
                                   setFormData((prev) => ({
                                        ...prev,
                                        isPinned: isChecked
                                   }));
                              }}
                              label="Pin this link"
                              variant="default"
                              size="md"
                         />
                    </div>

                    {formData.showToPortal && (
                         <>
                              <Input
                                   label="Name for Portal"
                                   name="nameUrl"
                                   type="text"
                                   value={formData.nameUrl || ""}
                                   onChange={handleChange}
                              />

                              <CategorySelect
                                   label="Category"
                                   value={formData.category || ""}
                                   onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                              />

                              <Input
                                   label="Description"
                                   name="description"
                                   type="text"
                                   value={formData.description || ""}
                                   onChange={handleChange}
                              />

                              <Input
                                   label="Price"
                                   name="price"
                                   type="number"
                                   step="0.01"
                                   min="0"
                                   value={formData.price || ""}
                                   onChange={handleChange}
                              />

                              {formData.useMultipleUrls && (
                                   <div className="space-y-2">
                                        <label className="text-white text-sm font-medium">Additional URLs</label>
                                        {(!formData.multipleUrls || formData.multipleUrls.length === 0) && (
                                             <p className="text-yellow-400 text-sm">Please add at least one URL.</p>
                                        )}
                                        <div className="flex flex-col md:flex-row w-full md:gap-2 space-y-3 md:space-y-0">
                                             <Input
                                                  type="url"
                                                  value={newUrl}
                                                  onChange={(e) => setNewUrl(e.target.value)}
                                                  placeholder="Enter URL"
                                                  className="w-full "
                                             />
                                             <Input
                                                  type="text"
                                                  value={newUrlName}
                                                  onChange={(e) => setNewUrlName(e.target.value)}
                                                  placeholder="Enter URL Name (optional)"
                                                  className="w-full "
                                             />
                                             <Button
                                                  type="button"
                                                  variant="primary"
                                                  onClick={addOrUpdateUrl}
                                                  disabled={!newUrl}
                                             >
                                                  {editingIndex !== null ? <PencilIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                                             </Button>
                                        </div>
                                        {formData.multipleUrls && formData.multipleUrls.length > 0 && (
                                             <div className="space-y-1">
                                                  {formData.multipleUrls.map((urlObj, index) => (
                                                       <div key={index} className="flex items-center justify-between text-gray-300 text-sm">
                                                            <span className="truncate max-w-[70%]">{urlObj.name || urlObj.url}</span>
                                                            <div className="flex space-x-2">
                                                                 <Button
                                                                      type="button"
                                                                      variant="secondary"
                                                                      onClick={() => editUrl(index)}
                                                                 >
                                                                      <PencilIcon className="w-4 h-4" />
                                                                 </Button>
                                                                 <Button
                                                                      type="button"
                                                                      variant="danger"
                                                                      onClick={() => removeUrl(index)}
                                                                 >
                                                                      <TrashIcon className="w-4 h-4" />
                                                                 </Button>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              )}
                         </>
                    )}

                    <Toggle
                         checked={formData.showConfirmationPage || false}
                         onChange={(isChecked) => {
                              setFormData((prev) => ({
                                   ...prev,
                                   showConfirmationPage: isChecked
                              }));
                         }}
                         label="Show Confirmation Page"
                         variant="default"
                         size="md"
                    />

                    {formData.showConfirmationPage && (
                         <Input
                              label="Custom Message"
                              name="confirmationPageSettings.customMessage"
                              type="text"
                              value={formData.confirmationPageSettings?.customMessage || ""}
                              onChange={handleChange}
                              className="bg-gray-700 text-gray-300 border-gray-600"
                         />
                    )}

                    <div className="flex space-x-4">
                         <Button
                              type="submit"
                              disabled={isSubmitting}
                              variant="primary"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                         >
                              {isSubmitting ? "Saving..." : initialData ? "Update Link" : "Create Link"}
                         </Button>
                         <Button
                              type="button"
                              variant="danger"
                              onClick={onCancel}
                              disabled={isSubmitting}
                              className="bg-gray-600 text-white hover:bg-gray-500"
                         >
                              Cancel
                         </Button>
                    </div>
               </form>
          </div>
     );
}