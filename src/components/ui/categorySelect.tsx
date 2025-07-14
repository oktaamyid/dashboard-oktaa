import React, { useState, useEffect, useCallback } from "react";
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './button';
import Input from './input';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Link } from "@/app/types";

interface CategorySelectProps {
     label?: string;
     value?: string;
     onChange: (value: string) => void;
     error?: string;
     className?: string;
     placeholder?: string;
     disabled?: boolean;
}

export default function CategorySelect({
     label,
     value = "",
     onChange,
     error,
     className = "",
     placeholder = "Select or create category..",
     disabled = false
}: CategorySelectProps) {
     const [categories, setCategories] = useState<string[]>([]);
     const [isAddingNew, setIsAddingNew] = useState(false);
     const [newCategory, setNewCategory] = useState("");
     const [loading, setLoading] = useState(true);

     const fetchCategories = useCallback(async () => {
          try {
               setLoading(true);
               const linksSnapshot = await getDocs(collection(db, "links"));
               const links: Link[] = linksSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
               })) as Link[];

               // Extract unique categories
               const categorySet = new Set<string>();
               links.forEach((link) => {
                    if (link.category && link.category.trim()) {
                         categorySet.add(link.category.trim());
                    }
               });

               const sortedCategories = Array.from(categorySet).sort();
               setCategories(sortedCategories);
          } catch (error) {
               console.error("Error fetching categories:", error);
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          fetchCategories();
     }, [fetchCategories]);

     const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const selectedValue = e.target.value;
          if (selectedValue === "__ADD_NEW__") {
               setIsAddingNew(true);
          } else {
               onChange(selectedValue);
          }
     };

     const handleAddNewCategory = () => {
          if (newCategory.trim()) {
               const trimmedCategory = newCategory.trim();
               // Add the new category to the list if it doesn't exist
               if (!categories.some(cat => cat.toLowerCase() === trimmedCategory.toLowerCase())) {
                    setCategories(prev => [...prev, trimmedCategory].sort());
               }
               // Set the new category as the selected value
               onChange(trimmedCategory);
               setNewCategory("");
               setIsAddingNew(false);
          }
     };

     const handleCancelAdd = () => {
          setNewCategory("");
          setIsAddingNew(false);
     };

     if (isAddingNew) {
          return (
               <div className="flex flex-col space-y-1">
                    {label && (
                         <label className="text-gray-300 text-sm font-semibold mb-1">
                              {label}
                         </label>
                    )}
                    <div className="flex gap-2">
                         <Input
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="Enter new category name"
                              className="flex-1"
                              onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddNewCategory();
                                   } else if (e.key === 'Escape') {
                                        handleCancelAdd();
                                   }
                              }}
                              autoFocus
                         />
                         <Button
                              type="button"
                              variant="primary"
                              onClick={handleAddNewCategory}
                              disabled={!newCategory.trim()}
                              className="px-3"
                         >
                              <PlusIcon className="w-4 h-4" />
                         </Button>
                         <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelAdd}
                              className="px-3"
                         >
                              <XMarkIcon className="w-4 h-4" />
                         </Button>
                    </div>
                    {error && (
                         <p className="text-red-400 text-xs mt-1">{error}</p>
                    )}
               </div>
          );
     }

     return (
          <div className="flex flex-col space-y-1">
               {label && (
                    <label className="text-gray-300 text-sm font-semibold mb-1">
                         {label}
                    </label>
               )}
               <div className="relative">
                    <select
                         className={`bg-gray-700 text-gray-300 p-2 pr-8 rounded-lg border ${error ? "border-red-500" : "border-gray-500"
                              } shadow-md focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all duration-300 w-full ${disabled ? "opacity-50 cursor-not-allowed" : ""
                              } ${className}`}
                         value={value}
                         onChange={handleSelectChange}
                         disabled={loading || disabled}
                    >
                         <option value="" className="bg-gray-800">
                              {loading ? "Loading categories..." : placeholder}
                         </option>
                         {categories.map((category) => (
                              <option
                                   key={category}
                                   value={category}
                                   className="bg-gray-800 hover:bg-gray-600"
                              >
                                   {category}
                              </option>
                         ))}
                         <option
                              value="__ADD_NEW__"
                              className="bg-gray-800 border-t border-gray-600 font-semibold text-blue-400"
                         >
                              + Add New Category
                         </option>
                    </select>
               </div>
               {error && (
                    <p className="text-red-400 text-xs mt-1">{error}</p>
               )}
          </div>
     );
}
