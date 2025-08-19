// src/components/features/api-builder/apiBuilderForm.tsx

"use client";
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import Toggle from "@/components/ui/toggle";
import { ApiEndpoint } from "@/app/types";
import { toIsoWithLocalTZ, normalizeDateTimeForInput } from "@/lib/utils/parseDate";

const FIELD_TYPES = [
     { label: "Text", value: "text" },
     { label: "Number", value: "number" },
     { label: "Boolean", value: "boolean" },
     { label: "Date", value: "date" },
];

interface ApiBuilderFormProps {
     initialData?: ApiEndpoint;
     onSubmit: (endpoint: ApiEndpoint, isEdit: boolean) => void;
     onCancel: () => void;
}

export default function ApiBuilderForm({
     initialData,
     onSubmit,
     onCancel,
}: ApiBuilderFormProps) {
     const [name, setName] = useState(initialData?.name || "");
     const [slug, setSlug] = useState(initialData?.slug || "");
     const [method, setMethod] = useState(initialData?.method || "GET");
     const [fields, setFields] = useState<ApiEndpoint["fields"]>(
          initialData?.fields || [
               { fieldName: "", type: "text", required: false, defaultValue: "" },
          ]
     );
     const [isSubmitting, setIsSubmitting] = useState(false);

     const handleFieldChange = (
          idx: number,
          key: string,
          value: string | number | boolean
     ) => {
          setFields((fields) =>
               fields.map((f, i) => (i === idx ? { ...f, [key]: value } : f))
          );
     };
     const addField = () =>
          setFields([
               ...fields,
               { fieldName: "", type: "text", required: false, defaultValue: "" },
          ]);
     const removeField = (idx: number) =>
          setFields((fields) => fields.filter((_, i) => i !== idx));

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);
          try {
               let endpointSlug = initialData?.slug;
               if (initialData) {
                    // Update
                    const res = await fetch(`/api/${initialData.slug}`, {
                         method: "PUT",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ name, slug, method, fields }),
                    });
                    if (!res.ok) throw new Error("Failed to update endpoint");
               } else {
                    // Create
                    const res = await fetch("/api/endpoints", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({ name, slug, method, fields }),
                    });
                    if (!res.ok) throw new Error("Failed to create endpoint");
                    const { slug: newSlug } = await res.json();
                    endpointSlug = newSlug;
               }
               onSubmit(
                    {
                         id: initialData?.id || "", // Add id to satisfy ApiEndpoint type
                         slug: endpointSlug!,
                         name,
                         method,
                         fields,
                    },
                    !!initialData
               );
          } catch (_err) {
               // Error handled in parent
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-8">
               <h2 className="text-lg font-semibold text-white mb-4">
                    {initialData ? "Edit Endpoint" : "Create New Endpoint"}
               </h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Input
                              label="API Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                         />
                         <Input
                              label="Slug (endpoint)"
                              value={slug}
                              onChange={(e) =>
                                   setSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))
                              }
                              required
                         />
                         <Select
                              label="Method"
                              value={method}
                              onChange={(e) => setMethod(e.target.value)}
                              options={[
                                   { label: "GET", value: "GET" },
                                   { label: "POST", value: "POST" },
                              ]}
                              className="md:col-span-2"
                         />
                    </div>
                    <div>
                         <label className="text-gray-300 text-sm font-semibold mb-2 block">
                              Fields
                         </label>
                         <div className="space-y-3">
                              {fields.map((field, idx) => (
                                   <div
                                        key={idx}
                                        className="flex flex-col md:flex-row gap-2 items-center bg-gray-700 p-3 rounded-lg border border-gray-600"
                                   >
                                        <Input
                                             placeholder="Field Name"
                                             value={field.fieldName}
                                             onChange={(e) =>
                                                  handleFieldChange(idx, "fieldName", e.target.value)
                                             }
                                             className="flex-1"
                                             required
                                        />
                                        <Select
                                             value={field.type}
                                             onChange={(e) =>
                                                  handleFieldChange(idx, "type", e.target.value)
                                             }
                                             options={FIELD_TYPES}
                                             className="w-32"
                                        />
                                        <Toggle
                                             checked={field.required}
                                             onChange={(v) =>
                                                  handleFieldChange(idx, "required", v)
                                             }
                                             label="Required"
                                             size="sm"
                                        />
                                        {field.type === "boolean" ? (
                                             <Toggle
                                                  checked={Boolean(field.defaultValue)}
                                                  onChange={(v) => handleFieldChange(idx, "defaultValue", v)}
                                                  label="Default Value"
                                                  size="sm"
                                             />
                                        ) : field.type === "number" ? (
                                             <Input
                                                  type="number"
                                                  placeholder="Default Value"
                                                  value={
                                                       typeof field.defaultValue === "number"
                                                            ? field.defaultValue
                                                            : ""
                                                  }
                                                  onChange={(e) => handleFieldChange(idx, "defaultValue", e.target.value === "" ? "" : Number(e.target.value))}
                                                  className="w-32"
                                             />
                                        ) : field.type === "date" ? (
                                             <Input
                                                  type="datetime-local"
                                                  value={
                                                       typeof field.defaultValue === "string"
                                                            ? normalizeDateTimeForInput(field.defaultValue)  // helper baru
                                                            : ""
                                                  }
                                                  onChange={(e) => handleFieldChange(idx, "defaultValue", toIsoWithLocalTZ(e.target.value))}
                                             />
                                        ) : (
                                             <Input
                                                  type="text"
                                                  placeholder="Default Value"
                                                  value={typeof field.defaultValue === "string" ? field.defaultValue : ""}
                                                  onChange={(e) => handleFieldChange(idx, "defaultValue", e.target.value)}
                                                  className="w-32"
                                             />
                                        )}
                                        <Button
                                             type="button"
                                             variant="danger"
                                             onClick={() => removeField(idx)}
                                             className="px-2"
                                        >
                                             Remove
                                        </Button>
                                   </div>
                              ))}
                              <Button
                                   type="button"
                                   variant="secondary"
                                   onClick={addField}
                                   className="w-full md:w-auto"
                              >
                                   + Add Field
                              </Button>
                         </div>
                    </div>
                    <div className="flex space-x-4 justify-end">
                         <Button
                              type="submit"
                              variant="primary"
                              disabled={isSubmitting}
                              className="px-8"
                         >
                              {isSubmitting
                                   ? initialData
                                        ? "Updating..."
                                        : "Creating..."
                                   : initialData
                                        ? "Update Endpoint"
                                        : "Create Endpoint"}
                         </Button>
                         <Button
                              type="button"
                              variant="secondary"
                              onClick={onCancel}
                              disabled={isSubmitting}
                         >
                              Cancel
                         </Button>
                    </div>
               </form>
          </div>
     );
}
