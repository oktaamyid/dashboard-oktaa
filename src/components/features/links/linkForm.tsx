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
               showConfirmationPage: false,
               confirmationPageSettings: { adEnabled: false, countdown: 5 },
          }
     );

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value, type, checked } = e.target;
          setFormData((prev) => ({
               ...prev,
               [name]: type === "checkbox" ? checked : value,
          }));
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
                    <Input
                         label="Original URL"
                         name="originalUrl"
                         type="url"
                         required
                         value={formData.originalUrl}
                         onChange={handleChange}
                    />

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
                         <>
                              <Input
                                   label="Countdown (seconds)"
                                   name="confirmationPageSettings.countdown"
                                   type="number"
                                   min="1"
                                   max="30"
                                   value={formData.confirmationPageSettings?.countdown || 5}
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

                    <div className="flex space-x-4">
                         <Button type="submit">{initialData ? "Update Link" : "Create Link"}</Button>
                         <Button type="submit" variant="danger" onClick={onCancel}>Cancel</Button>

                    </div>
               </form>
          </div>
     );
}
