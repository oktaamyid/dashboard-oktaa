// src/components/features/api-builder/apiBuilderTable.tsx

"use client";
import Table from "@/components/ui/table";
import Button from "@/components/ui/button";
import { ApiEndpoint } from "@/app/types";
import { PencilIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/outline"; // Import DocumentTextIcon

interface ApiBuilderTableProps {
     endpoints: ApiEndpoint[];
     onEdit: (endpoint: ApiEndpoint) => void;
     onDelete: (id: string) => void;
     isLoading?: boolean;
     renderActions?: (endpoint: ApiEndpoint) => React.ReactNode; 
     onViewDocs: (endpoint: ApiEndpoint) => void;
}

export default function ApiBuilderTable({ endpoints, onEdit, onDelete, isLoading = false, renderActions, onViewDocs }: ApiBuilderTableProps) {
     const columns = ["name", "slug", "method", "fields", "actions"];
     const columnLabels = {
          name: "Name",
          slug: "Slug",
          method: "Method",
          fields: "Fields",
          actions: "Actions"
     };

     const renderCell = (column: string, row: ApiEndpoint) => {
          switch (column) {
               case "name":
                    return row.name;
               case "slug":
                    return <span className="font-mono text-blue-300">/{row.slug}</span>;
               case "method":
                    return <span className="uppercase font-semibold text-green-400">{row.method}</span>;
               case "fields":
                    return <span>{row.fields.length}</span>;
               case "actions":
                    return (
                         <div className="flex space-x-2">
                              <Button variant="secondary" onClick={() => onEdit(row)} className="p-1">
                                   <PencilIcon className="w-5 h-5" />
                              </Button>
                              <Button variant="danger" onClick={() => onDelete(row.slug)} className="p-1">
                                   <TrashIcon className="w-5 h-5" />
                              </Button>
                              <Button variant="primary" onClick={() => onViewDocs(row)} className="p-1">
                                   <DocumentTextIcon className="w-5 h-5" />
                              </Button>
                              {renderActions && renderActions(row)}
                         </div>
                    );
               default:
                    return row[column as keyof ApiEndpoint] as React.ReactNode;
          }
     };

     return (
          <Table<ApiEndpoint>
               columns={columns}
               data={endpoints}
               isLoading={isLoading}
               renderCell={renderCell}
               columnLabels={columnLabels}
          />
     );
}
