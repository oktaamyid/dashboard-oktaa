"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Link } from "@/app/types";
import { getProfile, updateProfile } from "@/lib/service";
import Skeleton from "react-loading-skeleton";
import CategoryTable from "@/components/features/categories/categoryTable";
import CategoryMergeForm from "@/components/features/categories/categoryMergeForm";

interface Category {
     id: string;
     name: string;
     count: number;
}

export default function CategoriesPage() {
     const [categories, setCategories] = useState<Category[]>([]);
     const [loading, setLoading] = useState(true);
     const [sortSettings, setSortSettings] = useState<{ [categoryId: string]: { type?: "field" | "manual"; field?: string; direction?: "asc" | "desc"; order?: string[] } }>({});

     useEffect(() => {
          const fetchCategories = async () => {
               try {
                    const [linksResult, profileResult] = await Promise.allSettled([
                         getDocs(collection(db, "links")),
                         getProfile(),
                    ]);

                    const links: Link[] = linksResult.status === "fulfilled"
                         ? linksResult.value.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Link[]
                         : [];

                    const profile = profileResult.status === "fulfilled" ? profileResult.value : null;

                    const categoryMap = new Map<string, number>();
                    links.forEach((link) => {
                         if (link.category) {
                              const categoryKey = link.category.toLowerCase();
                              categoryMap.set(categoryKey, (categoryMap.get(categoryKey) || 0) + 1);
                         }
                    });

                    const dynamicCategories: Category[] = Array.from(categoryMap.entries()).map(([name, count]) => ({
                         id: name.replace(/\s+/g, "-"),
                         name,
                         count,
                    }));

                    setCategories(dynamicCategories);

                    if (profile?.categorySortSettings) {
                         setSortSettings(profile.categorySortSettings);
                    }
               } catch (error) {
                    console.error("Error fetching categories:", error);
               } finally {
                    setLoading(false);
               }
          };
          fetchCategories();
     }, []);

     const handleSaveSort = async (categoryId: string, field: string, direction: "asc" | "desc") => {
          try {
               const newSortSettings = { ...sortSettings, [categoryId]: { type: "field" as const, field, direction } };
               await updateProfile({ categorySortSettings: newSortSettings });
               setSortSettings(newSortSettings);
          } catch (error) {
               console.error("Error saving sort settings:", error);
               throw error;
          }
     };

     const handleMergeCategories = async (mergeFrom: string, mergeTo: string) => {
          try {
               const querySnapshot = await getDocs(collection(db, "links"));
               const batchUpdates = querySnapshot.docs
                    .filter((doc) => doc.data().category?.toLowerCase() === mergeFrom.toLowerCase())
                    .map((doc) => updateDoc(doc.ref, { category: mergeTo }));

               await Promise.all(batchUpdates);

               setCategories((prev) =>
                    prev
                         .map((cat) => (cat.name.toLowerCase() === mergeFrom.toLowerCase() ? null : cat))
                         .filter((cat): cat is Category => cat !== null)
                         .map((cat) =>
                              cat.name.toLowerCase() === mergeTo.toLowerCase()
                                   ? { ...cat, count: cat.count + (categories.find((c) => c.name.toLowerCase() === mergeFrom.toLowerCase())?.count || 0) }
                                   : cat
                         )
               );

               if (sortSettings[mergeFrom.toLowerCase().replace(/\s+/g, "-")]) {
                    const newSortSettings = { ...sortSettings };
                    newSortSettings[mergeTo.toLowerCase().replace(/\s+/g, "-")] = newSortSettings[mergeFrom.toLowerCase().replace(/\s+/g, "-")];
                    delete newSortSettings[mergeFrom.toLowerCase().replace(/\s+/g, "-")];
                    await updateProfile({ categorySortSettings: newSortSettings });
                    setSortSettings(newSortSettings);
               }
          } catch (error) {
               console.error("Error merging categories:", error);
               throw error;
          }
     };

     if (loading) {
          return (
               <div>
                    <h1 className="text-2xl font-bold text-white mb-6">Kelola Kategori</h1>
                    <Skeleton height={40} width="50%" className="mb-4" />
                    <Skeleton count={5} height={60} className="mb-2" />
               </div>
          );
     }

     return (
          <div>
               <h1 className="text-2xl font-bold text-white mb-6">Kelola Kategori</h1>
               <CategoryMergeForm categories={categories} onMerge={handleMergeCategories} />
               <CategoryTable
                    categories={categories}
                    sortSettings={sortSettings}
                    onSortChange={handleSaveSort}
                    setSortSettings={setSortSettings}
               />
          </div>
     );
}