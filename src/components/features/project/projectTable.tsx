"use client";

import { Project } from '@/app/types';
import Table from '@/components/ui/table';
import Button from '@/components/ui/button';
import Image from 'next/image';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteImage } from '@/lib/service';
import { useToast } from '@/components/ui/toast';

interface ProjectTableProps {
     projects: Project[];
     onEdit: (project: Project) => void;
     onDelete: (id: string) => void;
     isLoading?: boolean;
}

export default function ProjectTable({ projects, onEdit, onDelete, isLoading = false }: ProjectTableProps) {
     const { showSuccess, showError } = useToast();
     const columns = ['title', 'description', 'link', 'technology', 'actions'];

     const renderCell = (column: string, row: Project) => {
          switch (column) {
               case 'title':
                    return row.title;
               case 'image':
                    return row.image ? (
                         <Image src={row.image} alt={row.title} width={50} height={50} className="rounded object-cover" />
                    ) : (
                         '-'
                    );
               case 'description':
                    return (
                         <span className="truncate max-w-xs block" title={row.description}>
                              {row.description}
                         </span>
                    );
               case 'link':
                    return row.link ? (
                         <a
                              href={row.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                         >
                              {row.link}
                         </a>
                    ) : (
                         '-'
                    );
               case 'technology':
                    return row.technology.join(', ');
               case 'actions':
                    return (
                         <div className="flex space-x-2">
                              <Button
                                   variant="secondary"
                                   onClick={() => onEdit(row)}
                                   className="px-2 py-1"
                              >
                                   <PencilIcon className="w-5 h-5" />
                              </Button>
                              <Button
                                   variant="danger"
                                   onClick={async () => {
                                        if (confirm('Are you sure you want to delete this project?')) {
                                             try {
                                                  if (row.image) {
                                                       await deleteImage(row.image);
                                                  }
                                                  await onDelete(row.id);
                                             } catch (error) {
                                                  console.error('Failed to delete project or image:', error);
                                                  showError('Failed to delete project');
                                             }
                                        }
                                   }}
                                   className="px-2 py-1"
                              >
                                   <TrashIcon className="w-5 h-5" />
                              </Button>
                         </div>
                    );
               default:
                    return null;
          }
     };

     return (
          <div className="">
               {isLoading ? (
                    <Table
                         columns={columns}
                         data={[]}
                         isLoading={true}
                         renderCell={renderCell}
                         columnLabels={{
                              title: 'Title',
                              image: 'Image',
                              description: 'Description',
                              link: 'Link',
                              technology: 'Technologies',
                              actions: 'Actions',
                         }}
                    />
               ) : projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-300">No projects found. Add your first project!</div>
               ) : (
                    <Table
                         columns={columns}
                         data={projects}
                         isLoading={false}
                         renderCell={renderCell}
                         columnLabels={{
                              title: 'Title',
                              description: 'Description',
                              link: 'Link',
                              technology: 'Technologies',
                              actions: 'Actions',
                         }}
                    />
               )}
          </div>
     );
}