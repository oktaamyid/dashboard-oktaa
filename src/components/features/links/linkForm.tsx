"use client";

import { useState } from "react";
import { Link } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface LinkFormProps {
     initialData?: Link;
     onSubmit: (data: Link) => void;
     onCancel: () => void;
}

export default function LinkForm({ initialData, onSubmit, onCancel }: LinkFormProps) {
     const [formData, setFormData] = useState<Link>(
          initialData || {
               id: "",
               originalUrl: "",
               shortUrl: "",
               showConfirmationPage: false,
               confirmationPageSettings: { adEnabled: false, countdown: 5, customMessage: "" },
          }
     );

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value, type, checked } = e.target;
     
          setFormData((prev) => {
               if (name.startsWith("confirmationPageSettings.")) {
                    const key = name.split(".")[1];
     
                    return {
                         ...prev,
                         confirmationPageSettings: {
                              ...prev.confirmationPageSettings,
                              [key]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
                              adEnabled: prev.confirmationPageSettings?.adEnabled ?? false,
                              countdown: prev.confirmationPageSettings?.countdown ?? 5, // Set default jika undefined
                              customMessage: prev.confirmationPageSettings?.customMessage ?? "", // Default kosong
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
                         <>
                              <Input
                                   label="Countdown (seconds)"
                                   name="confirmationPageSettings.countdown"
                                   type="number"
                                   min="1"
                                   max="30"
                                   value={formData.confirmationPageSettings?.countdown || ""}
                                   onChange={handleChange}
                              />
                              <Input
                                   label="Custom Message"
                                   name="confirmationPageSettings.customMessage"
                                   type="text"
                                   value={formData.confirmationPageSettings?.customMessage || ""}
                                   onChange={handleChange}
                              />
                         </>
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
