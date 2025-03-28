"use client";

import { useState } from "react";
import Table from "@/components/ui/table";
import Button from "@/components/ui/button";
import { Link } from "@/app/types";

interface LinkTableProps {
     links: Link[];
     onEdit: (link: Link) => void;
     onDelete: (id: string) => void;
     isLoading?: boolean;
}

export default function LinkTable({ links, onEdit, onDelete, isLoading = false }: LinkTableProps) {
     const columns = ["id", "shortUrl", "originalUrl", "clicks", "actions"];
     const [copiedId, setCopiedId] = useState<string | null>(null);

     const handleCopy = async (shortUrl: string | undefined, id: string) => {
          if (!shortUrl) return;
          
          const fullUrl = `${window.location.origin}/${shortUrl}`;

          try {
               await navigator.clipboard.writeText(fullUrl);
               setCopiedId(id);
               setTimeout(() => setCopiedId(null), 2000);
          } catch (err) {
               console.error("Failed to copy:", err);
          }
     };

     const tableData = links.map((link) => ({
          id: link.id,
          shortUrl: link.shortUrl || "-",
          originalUrl: link.originalUrl,
          clicks: link.clicks || 0,
          showConfirmationPage: link.showConfirmationPage || false, // Tetap ada agar tidak error
          actions: (
               <div className="flex space-x-2">
                    <Button variant="secondary" onClick={() => onEdit(link)}>Edit</Button>
                    <Button
                         variant="danger"
                         onClick={() => {
                              if (confirm("Are you sure you want to delete this link?")) {
                                   onDelete(link.id);
                              }
                         }}
                    >
                         Delete
                    </Button>
                    <Button
                         variant="primary"
                         disabled={!link.shortUrl}
                         onClick={() => handleCopy(link.shortUrl, link.id)}
                    >
                         {copiedId === link.id ? "Copied!" : "Copy"}
                    </Button>
                    <Button type="button" variant="primary">
                         Detail
                    </Button>
               </div>
          ),
     }));

     return <Table columns={columns} data={tableData} isLoading={isLoading} />;
}
