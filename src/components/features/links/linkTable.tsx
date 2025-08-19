// components/link-table.tsx
"use client";

import { useState } from "react";
import Table from "@/components/ui/table";
import Button from "@/components/ui/button";
import LinkAnalytics from "@/components/features/links/linkAnalytics";
import { Link } from "@/app/types";
import { PencilIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import Input from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface LinkTableProps {
     links: Link[];
     onEdit: (link: Link) => void;
     onDelete: (id: string) => void;
     isLoading?: boolean;
}

interface LinkTableRow {
     id: string;
     name: string;
     originalUrl: string;
     shortUrl: string;
     clicks: number;
     showToPortal: boolean;
     showConfirmationPage: boolean;
}

export default function LinkTable({ links, onEdit, onDelete, isLoading = false }: LinkTableProps) {
     const { showError } = useToast();
     const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
     const [searchTerm, setSearchTerm] = useState("");

     const toggleAnalytics = (id: string) => {
          setExpandedLinkId(expandedLinkId === id ? null : id);
     };

     const columns = [
          "name",
          "originalUrl",
          "shortUrl",
          "clicks",
          "status",
          "actions"
     ];

     const filteredData = links.filter(link => {
          return Object.values({
               name: link.nameUrl || '',
               originalUrl: link.originalUrl,
               shortUrl: link.shortUrl || '',
               clicks: String(link.clicks || 0),
               status: `${link.showToPortal ? "Yes" : "No"}, ${link.showConfirmationPage ? "Yes" : "No"}`,
          }).some(value =>
               value.toLowerCase().includes(searchTerm.toLowerCase())
          );
     });

     const renderCell = (column: string, row: LinkTableRow) => {
          const link = links.find(l => l.id === row.id)!;

          switch (column) {
               case 'name':
                    return link.nameUrl || '-';
               case 'originalUrl':
                    return (
                         <span className="truncate max-w-xs block" title={link.originalUrl}>
                              {link.originalUrl}
                         </span>
                    );
               case 'shortUrl':
                    return link.shortUrl ? (
                         <a
                              href={`/${link.shortUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                         >
                              /{link.shortUrl}
                         </a>
                    ) : '-';
               case 'clicks':
                    return (
                         <div
                              className="flex items-center cursor-pointer"
                              onClick={() => toggleAnalytics(link.id)}
                         >
                              {link.clicks || 0}
                              {expandedLinkId === link.id ? (
                                   <ChevronUpIcon className="w-4 h-4 ml-1" />
                              ) : (
                                   <ChevronDownIcon className="w-4 h-4 ml-1" />
                              )}
                         </div>
                    );
               case 'status':
                    return (
                         <div className="flex flex-col">
                              <span>Portal: {link.showToPortal ? "Yes" : "No"}</span>
                              <span>Confirm: {link.showConfirmationPage ? "Yes" : "No"}</span>
                         </div>
                    );
               case 'actions':
                    return (
                         <div className="flex space-x-2">
                              <Button
                                   variant="secondary"
                                   onClick={() => onEdit(link)}
                                   className="p-1"
                                   aria-label="Edit"
                              >
                                   <PencilIcon className="w-5 h-5" />
                              </Button>
                              <Button
                                   variant="danger"
                                   onClick={async () => {
                                        if (confirm("Are you sure you want to delete this link?")) {
                                             try {
                                                  await onDelete(link.id);
                                             } catch (error) {
                                                  console.error('Failed to delete link: ', error);
                                                  showError('Failed to delete link');
                                             }
                                        }
                                   }}
                                   className="p-1"
                                   aria-label="Delete"
                              >
                                   <TrashIcon className="w-5 h-5" />
                              </Button>
                         </div>
                    );
               default:
                    return row[column as keyof LinkTableRow] as React.ReactNode;
          }
     };

     const renderExpandedRow = (row: LinkTableRow) => {
          const link = links.find(l => l.id === row.id);
          return link ? <LinkAnalytics link={link} /> : null;
     };

     return (
          <div className="mt-6">
               <Input
                    type="text"
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    label="Search"
               />

               {isLoading ? (
                    <Table
                         columns={columns}
                         data={[]}
                         isLoading={true}
                         expandedRowId={null}
                         renderExpandedRow={renderExpandedRow}
                         renderCell={renderCell}
                    />
               ) : links.length === 0 ? (
                    <div className="text-center py-8 text-gray-300">No links found. Add your first link!</div>
               ) : (
                    <Table<LinkTableRow>
                         columns={columns}
                         data={filteredData.map(link => ({
                              id: link.id,
                              name: link.nameUrl || '',
                              originalUrl: link.originalUrl,
                              shortUrl: link.shortUrl || '',
                              clicks: link.clicks || 0,
                              showToPortal: link.showToPortal || false,
                              showConfirmationPage: link.showConfirmationPage || false
                         }))}
                         isLoading={false}
                         expandedRowId={expandedLinkId}
                         renderExpandedRow={renderExpandedRow}
                         renderCell={renderCell}
                    />
               )}
          </div>
     );
}