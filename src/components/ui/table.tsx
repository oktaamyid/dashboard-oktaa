"use client";

import React, { useState, useEffect } from 'react';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';

interface TableProps<T> {
     data: T[];
     columns: string[];
     isLoading?: boolean;
     expandedRowId?: string | null;
     renderExpandedRow?: (row: T) => React.ReactNode;
     renderCell?: (column: string, row: T) => React.ReactNode;
     columnLabels?: { [key: string]: string };
}

export default function Table<T extends { id: string }>({
     data,
     columns,
     isLoading = false,
     expandedRowId,
     renderExpandedRow,
     renderCell,
     columnLabels,
}: TableProps<T>) {
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage, setItemsPerPage] = useState(10);

     // Reset currentPage to 1 when data changes (e.g., after filtering)
     useEffect(() => {
          setCurrentPage(1);
     }, [data]);

     // Adjust currentPage when itemsPerPage or totalItems changes
     useEffect(() => {
          const totalItems = data.length;
          const newTotalPages = Math.ceil(totalItems / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
               setCurrentPage(newTotalPages);
          }
     }, [itemsPerPage, data.length, currentPage]);

     // Calculate pagination
     const totalItems = data.length;
     const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); // Ensure at least 1 page
     const startIndex = (currentPage - 1) * itemsPerPage;
     const endIndex = startIndex + itemsPerPage;
     const paginatedData = data.slice(startIndex, endIndex);

     // Handle page change
     const handlePageChange = (page: number) => {
          if (page >= 1 && page <= totalPages) {
               setCurrentPage(page);
          }
     };

     // Handle items per page change
     const handleItemsPerPageChange = (value: string) => {
          const newItemsPerPage = parseInt(value);
          setItemsPerPage(newItemsPerPage);
          setCurrentPage(1); // Reset to first page for consistent UX
     };

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
                                             {columnLabels?.[column] || column}
                                        </th>
                                   ))}
                              </tr>
                         </thead>
                         <tbody>
                              {isLoading ? (
                                   Array.from({ length: 5 }).map((_, index) => (
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
                              ) : paginatedData.length === 0 ? (
                                   <tr>
                                        <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-300">
                                             No data available
                                        </td>
                                   </tr>
                              ) : (
                                   paginatedData.map((row) => (
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
                                   ))
                              )}
                         </tbody>
                    </table>
               </div>

               {/* Pagination Controls */}
               {!isLoading && totalItems > 0 && (
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between bg-gray-700 p-4 rounded-lg border border-gray-600">
                         <div className="flex items-center mb-2 sm:mb-0">
                              <span className="text-sm text-gray-300 mr-2">Items per page:</span>
                              <Select
                                   value={itemsPerPage.toString()}
                                   onChange={(e) => handleItemsPerPageChange(e.target.value)}
                                   options={[
                                        { value: '5', label: '5' },
                                        { value: '10', label: '10' },
                                        { value: '25', label: '25' },
                                        { value: '50', label: '50' },
                                   ]}
                                   className="bg-gray-700 text-gray-300 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                         </div>

                         <div className="flex items-center space-x-2">
                              <Button
                                   onClick={() => handlePageChange(currentPage - 1)}
                                   disabled={currentPage === 1}
                                   className={`px-3 py-1 text-sm ${currentPage === 1
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                              >
                                   Previous
                              </Button>

                              {/* Page Numbers */}
                              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                   <Button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 text-sm ${currentPage === page
                                             ? 'bg-blue-600 text-white'
                                             : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                             }`}
                                   >
                                        {page}
                                   </Button>
                              ))}

                              <Button
                                   onClick={() => handlePageChange(currentPage + 1)}
                                   disabled={currentPage === totalPages}
                                   className={`px-3 py-1 text-sm ${currentPage === totalPages
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                              >
                                   Next
                              </Button>
                         </div>
                    </div>
               )}
          </div>
     );
}