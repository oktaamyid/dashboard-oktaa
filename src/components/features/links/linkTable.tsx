"use client";

import Table from "@/components/ui/table";
import Button from "@/components/ui/button";
import { Link } from "@/app/types";

interface LinkTableProps {
     links: Link[];
     onEdit: (link: Link) => void;
     onDelete: (id: string) => void;
}

export default function LinkTable({ links, onEdit, onDelete }: LinkTableProps) {
     const columns = ["id", "shortUrl", "originalUrl", "clicks", "actions"];

     const tableData = links.map((link) => ({
          id: link.id,
          shortUrl: link.shortUrl || "-",
          originalUrl: link.originalUrl,
          clicks: link.clicks || 0,
          showConfirmationPage: link.showConfirmationPage || false,
          actions: (
               <div className="flex space-x-2">
                    <Button variant="secondary" onClick={() => onEdit(link)}>Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(link.id)}>Delete</Button>
               </div>
          ),
     }));

     return <Table columns={columns} data={tableData} />;
}
