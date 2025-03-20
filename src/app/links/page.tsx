"use client";

import { useEffect, useState } from "react";
import LinkTable from "@/components/features/links/linkTable";
import LinkForm from "@/components/features/links/linkForm";
import { getLinks, createLink, updateLink, deleteLink } from "@/lib/firestore";
import { Link } from "@/app/types";

export default function LinksPage() {
     const [links, setLinks] = useState<Link[]>([]);
     const [editingLink, setEditingLink] = useState<Link | null>(null);
     const [isFormVisible, setFormVisible] = useState(false);

     useEffect(() => {
               const fetchData = async () => {
                    const data = await getLinks();
               setLinks(data);
          };

          fetchData();
     }, []);

     const handleCreateOrUpdate = async (linkData: Omit<Link, "id">, id?: string) => {
          if (id) {
               await updateLink(id, linkData);
               setLinks((prevLinks) =>
                    prevLinks.map((link) => (link.id === id ? { ...link, ...linkData } : link))
               );
          } else {
               const newLink = await createLink(linkData);
               setLinks((prevLinks) => [...prevLinks, { id: newLink.id, ...linkData }]);
          }

          setEditingLink(null);
          setFormVisible(false);
     };

     const handleDelete = async (id: string) => {
          await deleteLink(id);
          setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
     };

     return (
          <div>
               <h1 className="text-2xl font-bold mb-6">Links</h1>

               {isFormVisible ? (
                    <LinkForm
                         onSubmit={handleCreateOrUpdate}
                         initialData={editingLink || undefined}
                         onCancel={() => {
                              setEditingLink(null);
                              setFormVisible(false);
                         }}
                    />
               ) : (
                    <button onClick={() => setFormVisible(true)} className="bg-blue-500 text-white p-2 rounded">
                         + Add Link
                    </button>
               )}

               <LinkTable
                    links={links}
                    onEdit={(link) => {
                         setEditingLink(link);
                         setFormVisible(true);
                    }}
                    onDelete={handleDelete}
               />
          </div>
     );
}
