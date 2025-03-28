"use client";

import { TableData } from "@/app/types";

interface TableProps {
     data: TableData[];
     columns: string[];
     isLoading?: boolean;
}

export default function Table({ data, columns, isLoading = false }: TableProps) {
     return (
          <div className="mt-6">
               <div className="max-h-[400px] overflow-y-auto overflow-x-auto border border-gray-600 rounded-lg">
                    <table className="min-w-full w-full bg-gray-700 rounded-lg shadow-lg">
                         <thead className="sticky top-0 z-10 bg-gray-600">
                              <tr>
                                   {columns.map((column) => (
                                        <th
                                             key={column}
                                             className="px-4 py-3 border-b-2 border-gray-500 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap"
                                        >
                                             {column}
                                        </th>
                                   ))}
                              </tr>
                         </thead>
                         <tbody>
                              {isLoading
                                   ? // ⏳ Skeleton Loading Effect
                                   Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="animate-pulse">
                                             {columns.map((column) => (
                                                  <td key={column} className="px-4 py-4 border-b border-gray-500">
                                                       <div className="h-4 bg-gray-500 rounded w-full"></div>
                                                  </td>
                                             ))}
                                        </tr>
                                   ))
                                   : // 📝 Data Tabel Saat Sudah Dimuat
                                   data.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-600 transition-all duration-300">
                                             {columns.map((column) => {
                                                  const value = row[column as keyof TableData] as string | string[];

                                                  return (
                                                       <td
                                                            key={column}
                                                            className="px-4 py-4 border-b border-gray-500 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                                                       >
                                                            {Array.isArray(value) ? value.join(", ") : value}
                                                       </td>
                                                  );
                                             })}
                                        </tr>
                                   ))}
                         </tbody>
                    </table>
               </div>
          </div>
     );
}