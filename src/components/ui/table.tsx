// components/ui/table.tsx
"use client";

import React from 'react';

interface TableProps<T> {
     data: T[];
     columns: string[];
     isLoading?: boolean;
     expandedRowId?: string | null;
     renderExpandedRow?: (row: T) => React.ReactNode;
     renderCell?: (column: string, row: T) => React.ReactNode;
}

export default function Table<T extends { id: string }>({
     data,
     columns,
     isLoading = false,
     expandedRowId,
     renderExpandedRow,
     renderCell
}: TableProps<T>) {
     return (
          <div className="mt-6">
               <div className="min-h-full overflow-y-auto overflow-x-auto border border-gray-600 rounded-lg">
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
                                   ? Array.from({ length: 5 }).map((_, index) => (
                                        <React.Fragment key={index}>
                                             <tr className="animate-pulse">
                                                  {columns.map((column) => (
                                                       <td key={column} className="px-4 py-4 border-b border-gray-500">
                                                            <div className="h-4 bg-gray-500 rounded w-full"></div>
                                                       </td>
                                                  ))}
                                             </tr>
                                             <tr>
                                                  <td colSpan={columns.length} className="px-4 py-4 border-b border-gray-500">
                                                       <div className="h-16 bg-gray-500 rounded animate-pulse"></div>
                                                  </td>
                                             </tr>
                                        </React.Fragment>
                                   ))
                                   : data.map((row) => (
                                        <React.Fragment key={row.id}>
                                             <tr className="border-b border-gray-500 hover:bg-gray-600 transition-all duration-300">
                                                  {columns.map((column) => (
                                                       <td
                                                            key={column}
                                                            className="px-4 py-4 text-sm text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                                                       >
                                                            {renderCell
                                                                 ? renderCell(column, row)
                                                                 : (row[column as keyof T] as React.ReactNode)}
                                                       </td>
                                                  ))}
                                             </tr>
                                             {expandedRowId === row.id && renderExpandedRow && (
                                                  <tr>
                                                       <td colSpan={columns.length} className="px-4 py-2 bg-gray-600">
                                                            {renderExpandedRow(row)}
                                                       </td>
                                                  </tr>
                                             )}
                                        </React.Fragment>
                                   ))}
                         </tbody>
                    </table>
               </div>
          </div>
     );
}