"use client";

import Table from "@/components/ui/table";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

interface Category {
     id: string;
     name: string;
     count: number;
}

interface SortSettings {
     [categoryId: string]: { type?: "field" | "manual"; field?: string; direction?: "asc" | "desc"; order?: string[] };
}

interface Props {
     categories: Category[];
     sortSettings: SortSettings;
     onSortChange: (categoryId: string, field: string, direction: "asc" | "desc") => void;
     setSortSettings: React.Dispatch<React.SetStateAction<SortSettings>>;
     isLoading?: boolean;
}

export default function CategoryTable({ categories, sortSettings, onSortChange, setSortSettings, isLoading = false }: Props) {
     const { showSuccess, showError } = useToast();
     const columns = ["name", "count", "url", "sortField", "sortDirection", "actions"];

     const renderCell = (column: string, row: Category) => {
          const categoryId = row.name.toLowerCase().replace(/\s+/g, "-");
          const currentSort = sortSettings[categoryId] || { type: "field", field: "createdAt", direction: "desc" };

          switch (column) {
               case "name":
                    return row.name;
               case "count":
                    return row.count;
               case "url":
                    return (
                         <a
                              href={`https://hi.oktaa.my.id/portal#${row.name.toLowerCase().replace(/\s+/g, "-")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                         >
                              /{row.name}
                         </a>
                    );
               case "sortField":
                    return (
                          <Select
                                value={currentSort.field || "createdAt"}
                                onChange={(e) =>
                                      setSortSettings({
                                             ...sortSettings,
                                             [categoryId]: { type: "field", field: e.target.value, direction: currentSort.direction || "desc" },
                                      })
                                }
                                options={[
                                      { value: "createdAt", label: "Created Date" },
                                      { value: "nameUrl", label: "Name (A-Z)" },
                                      { value: "price", label: "Price" },
                                      { value: "clicks", label: "Click Count" },
                                ]}
                          />
                    );
               case "sortDirection":
                    return (
                         <Select
                              value={currentSort.direction || "desc"}
                              onChange={(e) =>
                                   setSortSettings({
                                        ...sortSettings,
                                        [categoryId]: { type: "field", field: currentSort.field || "createdAt", direction: e.target.value as "asc" | "desc" },
                                   })
                              }
                              options={[
                                   { value: "asc", label: "Ascending" },
                                   { value: "desc", label: "Descending" },
                              ]}
                         />
                    );
               case "actions":
                    return (
                         <Button
                              variant="primary"
                              onClick={() => {
                                   onSortChange(categoryId, currentSort.field || "createdAt", currentSort.direction || "desc")
                                   showSuccess("Sort settings saved successfully");
                              }}
                         >
                              Save
                         </Button>
                    );
               default:
                    return null;
          }
     };

     return (
          <div className="mt-6">
               {isLoading ? (
                    <Table
                         columns={columns}
                         data={[]}
                         isLoading={true}
                         renderCell={renderCell}
                    />
               ) : categories.length === 0 ? (
                    <div className="text-center py-8 text-gray-300">No categories found.</div>
               ) : (
                    <Table
                         columns={columns}
                         data={categories}
                         isLoading={false}
                         renderCell={renderCell}
                    />
               )}
          </div>
     );
}