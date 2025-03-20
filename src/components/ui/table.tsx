// components/ui/table.tsx
"use client";

import { TableData } from "@/app/types";

interface TableProps {
     data: TableData[];
     columns: string[];
}

export default function Table({ data, columns }: TableProps) {
     return (
          <div className="overflow-x-auto mt-6">
               <table className="min-w-full bg-gray-700 rounded-lg shadow-lg">
                    <thead>
                         <tr className="bg-gray-600">
                              {columns.map((column) => (
                                   <th
                                        key={column}
                                        className="px-6 py-3 border-b-2 border-gray-500 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                                   >
                                        {column}
                                   </th>
                              ))}
                         </tr>
                    </thead>
                    <tbody>
                         {data.map((row, index) => (
                              <tr key={index} className="hover:bg-gray-600 transition-all duration-300">
                                   {columns.map((column) => {
                                        const value = row[column as keyof TableData] as string | string[];

                                        return (
                                             <td key={column} className="px-6 py-4 border-b border-gray-500 text-sm text-gray-300">
                                                  {Array.isArray(value) ? value.join(", ") : value}
                                             </td>
                                        );
                                   })}
                              </tr>
                         ))}
                    </tbody>
               </table>
          </div>
     );
}
