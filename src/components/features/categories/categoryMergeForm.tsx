"use client";

import { useState } from "react";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface Category {
     id: string;
     name: string;
}

interface Props {
     categories: Category[];
     onMerge: (mergeFrom: string, mergeTo: string) => Promise<void>;
     onCancel: () => void;
}

export default function CategoryMergeForm({ categories, onMerge, onCancel }: Props) {
     const { showSuccess, showError } = useToast();
     const [mergeFrom, setMergeFrom] = useState("");
     const [mergeTo, setMergeTo] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(false);

          if (!mergeFrom || !mergeTo) {
               showError("Choose two categories to merge");
               return;
          }

          try {
               setIsSubmitting(true);
               await onMerge(mergeFrom, mergeTo);
               showSuccess("Categories successfully merged");
               setMergeFrom("");
               setMergeTo("");
          } catch (error) {
               showError("Failed to merge categories");
               console.error("Merge error:", error);
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
               <h2 className="text-xl font-semibold text-white mb-6">Merge Categories</h2>

               <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Select
                              label="Source Category"
                              value={mergeFrom}
                              onChange={(e) => setMergeFrom(e.target.value)}
                              options={[{ value: "", label: "Select Source Category" }, ...categories.map(cat => ({ value: cat.name, label: cat.name }))]}
                         />
                         <Select
                              label="Target Category"
                              value={mergeTo}
                              onChange={(e) => setMergeTo(e.target.value)}
                              options={[{ value: "", label: "Select Target Category" }, ...categories.map(cat => ({ value: cat.name, label: cat.name }))]}
                         />
                    </div>

                    <div className="flex space-x-4">
                         <Button type="submit" disabled={isSubmitting || !mergeFrom || !mergeTo}>
                              {isSubmitting ? "Merging..." : "Merge"}
                         </Button>
                         <Button type="button" variant="danger" onClick={onCancel}>
                              Cancel
                         </Button>
                    </div>
               </form>
          </div>
     );
}