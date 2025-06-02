"use client";

import { useState } from "react";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";

interface Category {
     id: string;
     name: string;
}

interface Props {
     categories: Category[];
     onMerge: (mergeFrom: string, mergeTo: string) => Promise<void>;
}

export default function CategoryMergeForm({ categories, onMerge }: Props) {
     const [mergeFrom, setMergeFrom] = useState("");
     const [mergeTo, setMergeTo] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error", message: string } | null>(null);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(false);
          setAlertMessage(null);

          if (!mergeFrom || !mergeTo) {
               setAlertMessage({ type: "error", message: "Choose two category to merge" });
               return;
          }

          try {
               setIsSubmitting(true);
               await onMerge(mergeFrom, mergeTo);
               setAlertMessage({ type: "success", message: "Category successfully merge" });
               setMergeFrom("");
               setMergeTo("");
          } catch (error) {
               setAlertMessage({ type: "error", message: "Category failed to merge" });
               console.error("Merge error:", error);
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
               {alertMessage && (
                    <div className="mb-4">
                         <Alert variant={alertMessage.type}>
                              {alertMessage.message}
                         </Alert>
                    </div>
               )}

               <h2 className="text-xl font-semibold text-white mb-6">Gabungkan Kategori</h2>

               <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Select
                              label="Kategori Asal"
                              value={mergeFrom}
                              onChange={(e) => setMergeFrom(e.target.value)}
                              options={[{ value: "", label: "Pilih Kategori Asal" }, ...categories.map(cat => ({ value: cat.name, label: cat.name }))]}
                         />
                         <Select
                              label="Kategori Tujuan"
                              value={mergeTo}
                              onChange={(e) => setMergeTo(e.target.value)}
                              options={[{ value: "", label: "Pilih Kategori Tujuan" }, ...categories.map(cat => ({ value: cat.name, label: cat.name }))]}
                         />
                    </div>

                    <div className="flex justify-end">
                         <Button type="submit" disabled={isSubmitting || !mergeFrom || !mergeTo}>
                              {isSubmitting ? "Menggabungkan..." : "Gabungkan"}
                         </Button>
                    </div>
               </form>
          </div>
     );
}