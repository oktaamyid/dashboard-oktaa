"use client";

import { useState } from "react";
import { Link } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface LinkFormProps {
     initialData?: Link;
     onSubmit: (data: Omit<Link, "id">) => void;
     onCancel: () => void;
}

export default function LinkForm({ initialData, onSubmit, onCancel }: LinkFormProps) {
     const [formData, setFormData] = useState<Omit<Link, "id">>({
          originalUrl: initialData?.originalUrl || "",
          shortUrl: initialData?.shortUrl || "",
          showToPortal: initialData?.showToPortal || false,
          showConfirmationPage: initialData?.showConfirmationPage || false,
          confirmationPageSettings: {
               customMessage: initialData?.confirmationPageSettings?.customMessage || "",
          },
     });

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
                    [name]: type === "checkbox" ? checked : value,
               };
          });
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
                    {/* Original URL */}
                    <Input
                         label="Original URL"
                         name="originalUrl"
                         type="url"
                         required
                         value={formData.originalUrl}
                         onChange={handleChange}
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
