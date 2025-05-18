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
          originalUrl: initialData?.originalUrl || "",
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
     const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track editing URL index

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
                    // Update existing URL
                    updatedUrls[editingIndex] = { url: newUrl, name: newUrlName || undefined };
               } else {
                    // Add new URL
                    updatedUrls.push({ url: newUrl, name: newUrlName || undefined });
               }
               return { ...prev, multipleUrls: updatedUrls };
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
          setFormData((prev) => ({
               ...prev,
               multipleUrls: prev.multipleUrls?.filter((_, i) => i !== index) || [],
          }));
          if (editingIndex === index) {
               setNewUrl("");
               setNewUrlName("");
               setEditingIndex(null);
          }
     };

     return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold text-white mb-4">
                    {initialData ? "Edit Link" : "Create New Link"}
               </h2>

               <form
                    onSubmit={(e) => {
                         e.preventDefault();
                         onSubmit(formData);
                    }}
                    className="space-y-4"
               >
                    {/* Use Multiple URLs Checkbox */}
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

                    {/* Original URL */}
                    <Input
                         label="Original URL"
                         name="originalUrl"
                         type="url"
                         required={!formData.useMultipleUrls} // Required only if not using multipleUrls
                         value={formData.originalUrl}
                         onChange={handleChange}
                         disabled={formData.useMultipleUrls} // Disable if using multipleUrls
                    />

                    {/* Short URL */}
                    <Input
                         label="Short URL"
                         name="shortUrl"
                         type="text"
                         required
                         value={formData.shortUrl}
                         onChange={handleChange}
                    />

                    {/* Show URL to Portal Checkbox */}
                    <label className="flex items-center space-x-2 text-white">
                         <input
                              type="checkbox"
                              name="showToPortal"
                              checked={formData.showToPortal}
                              onChange={handleChange}
                              className="w-4 h-4"
                         />
                         <span>Show to Portal?</span>
                    </label>

                    {/* Portal-specific Fields */}
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

                              {/* Multiple URLs Input */}
                              {formData.useMultipleUrls && (
                                   <div className="space-y-2">
                                        <label className="text-white text-sm font-medium">Additional URLs</label>
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
                                        {/* Display Added URLs */}
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

                    {/* Show Confirmation Page Checkbox */}
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

                    {/* Confirmation Page Settings */}
                    {formData.showConfirmationPage && (
                         <Input
                              label="Custom Message"
                              name="confirmationPageSettings.customMessage"
                              type="text"
                              value={formData.confirmationPageSettings?.customMessage || ""}
                              onChange={handleChange}
                         />
                    )}

                    {/* Buttons */}
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
