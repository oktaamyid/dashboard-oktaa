"use client";

import { useState } from "react";
import { Link } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";

interface LinkFormProps {
     initialData?: Link;
     onSubmit: (data: Omit<Link, "id">) => void;
     onCancel: () => void;
}

export default function LinkForm({ initialData, onSubmit, onCancel }: LinkFormProps) {
     const [formData, setFormData] = useState<Omit<Link, "id">>({
          originalUrl: initialData?.useMultipleUrls && initialData?.multipleUrls && initialData.multipleUrls.length > 0
               ? initialData.multipleUrls[0].url
               : initialData?.originalUrl || "",
          shortUrl: initialData?.shortUrl || "",
          multipleUrls: initialData?.multipleUrls || [],
          useMultipleUrls: initialData?.useMultipleUrls || false,
          showToPortal: initialData?.showToPortal || false,
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
                    const newOriginalUrl = isChecked && prev.multipleUrls && prev.multipleUrls.length > 0
                         ? prev.multipleUrls[0].url
                         : "";
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
          if (!newUrl) return;

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
     };

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (formData.useMultipleUrls && (!formData.multipleUrls || formData.multipleUrls.length === 0)) {
               alert("Please add at least one URL when using multiple URLs.");
               return;
          }
          onSubmit(formData);
     };

     return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold text-white mb-4">
                    {initialData ? "Edit Link" : "Create New Link"}
               </h2>

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

                    <label className="flex items-center space-x-2 text-white">
                         <input
                              type="checkbox"
                              name="showToPortal"
                              checked={formData.showToPortal || formData.useMultipleUrls}
                              onChange={(e) => {
                                   const isChecked = e.target.checked;
                                   setFormData((prev) => {
                                        const newOriginalUrl = isChecked && prev.useMultipleUrls && (prev.multipleUrls ?? []).length > 0
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
                              className="w-4 h-4"
                         />
                         <span>Show to Portal?</span>
                    </label>

                    <label className="flex items-center space-x-2 text-white">
                         <input
                              type="checkbox"
                              name="useMultipleUrls"
                              checked={formData.useMultipleUrls}
                              onChange={handleChange}
                              className="w-4 h-4"
                         />
                         <span>Use Multiple URLs (disables Original URL)</span>
                    </label>

                    {formData.showToPortal && (
                         <>
                              <Input
                                   label="Name for Portal"
                                   name="nameUrl"
                                   type="text"
                                   value={formData.nameUrl || ""}
                                   onChange={handleChange}
                              />

                              <Input
                                   label="Category"
                                   name="category"
                                   type="text"
                                   value={formData.category || ""}
                                   onChange={handleChange}
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
                                        <div className="flex space-x-2">
                                             <Input
                                                  type="url"
                                                  value={newUrl}
                                                  onChange={(e) => setNewUrl(e.target.value)}
                                                  placeholder="Enter URL"
                                             />
                                             <Input
                                                  type="text"
                                                  value={newUrlName}
                                                  onChange={(e) => setNewUrlName(e.target.value)}
                                                  placeholder="Enter URL Name (optional)"
                                             />
                                             <Button type="button" onClick={addOrUpdateUrl} disabled={!newUrl}>
                                                  {editingIndex !== null ? <FiEdit className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                                             </Button>
                                        </div>
                                        {formData.multipleUrls && formData.multipleUrls.length > 0 && (
                                             <div className="space-y-1">
                                                  {formData.multipleUrls.map((urlObj, index) => (
                                                       <div key={index} className="flex items-center justify-between text-gray-300 text-sm">
                                                            <span className="truncate max-w-[70%]">
                                                                 {urlObj.name || urlObj.url}
                                                            </span>
                                                            <div className="flex space-x-2">
                                                                 <Button
                                                                      type="button"
                                                                      variant="secondary"
                                                                      onClick={() => editUrl(index)}
                                                                 >
                                                                      <FiEdit className="w-4 h-4" />
                                                                 </Button>
                                                                 <Button
                                                                      type="button"
                                                                      variant="danger"
                                                                      onClick={() => removeUrl(index)}
                                                                 >
                                                                      <FiTrash2 className="w-4 h-4" />
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

                    <label className="flex items-center space-x-2 text-white">
                         <input
                              type="checkbox"
                              name="showConfirmationPage"
                              checked={formData.showConfirmationPage}
                              onChange={handleChange}
                              className="w-4 h-4"
                         />
                         <span>Show Confirmation Page</span>
                    </label>

                    {formData.showConfirmationPage && (
                         <Input
                              label="Custom Message"
                              name="confirmationPageSettings.customMessage"
                              type="text"
                              value={formData.confirmationPageSettings?.customMessage || ""}
                              onChange={handleChange}
                         />
                    )}

                    <div className="flex space-x-4">
                         <Button type="submit">
                              {initialData ? "Update Link" : "Create Link"}
                         </Button>
                         <Button type="button" variant="danger" onClick={onCancel}>
                              Cancel
                         </Button>
                    </div>
               </form>
          </div>
     );
}