"use client";

import React, { useState, useEffect } from 'react';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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

     // Reset currentPage when data changes
     useEffect(() => {
          setCurrentPage(1);
     }, [data]);

     // Adjust logic
     useEffect(() => {
          const totalItems = data.length;
          const newTotalPages = Math.ceil(totalItems / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
               setCurrentPage(newTotalPages);
          }
     }, [itemsPerPage, data.length, currentPage]);

     const totalItems = data.length;
     const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
     const startIndex = (currentPage - 1) * itemsPerPage;
     const endIndex = startIndex + itemsPerPage;
     const paginatedData = data.slice(startIndex, endIndex);

     const handlePageChange = (page: number) => {
          if (page >= 1 && page <= totalPages) {
               setCurrentPage(page);
          }
     };

     const handleItemsPerPageChange = (value: string) => {
          setItemsPerPage(parseInt(value));
          setCurrentPage(1);
     };

     return (
          <div className="mt-6 flex flex-col gap-4">
               {/* Wrapper Table */}
               <div className="overflow-x-auto border border-white/10 bg-black shadow-2xl">
                    <table className="table w-full rounded-none">
                         {/* Header */}
                         <thead>
                              <tr className="border-b border-white/20">
                                   {columns.map((column) => (
                                        <th
                                             key={column}
                                             className="rounded-none bg-black text-white text-[10px] uppercase font-bold tracking-[0.15em] px-6 py-4 h-12"
                                        >
                                             {columnLabels?.[column] || column}
                                        </th>
                                   ))}
                              </tr>
                         </thead>

                         {/* Body */}
                         <tbody>
                              {isLoading ? (
                                   // Loading Skeleton
                                   Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index} className="border-b border-white/5 animate-pulse">
                                             {columns.map((column) => (
                                                  <td key={column} className="px-6 py-4">
                                                       <div className="h-4 bg-white/10 w-3/4 mx-auto rounded-none"></div>
                                                  </td>
                                             ))}
                                        </tr>
                                   ))
                              ) : paginatedData.length === 0 ? (
                                   // Empty State
                                   <tr>
                                        <td colSpan={columns.length} className="text-center py-12 text-zinc-500 uppercase tracking-widest text-xs">
                                             No data found
                                        </td>
                                   </tr>
                              ) : (
                                   // Data Rows
                                   paginatedData.map((row) => (
                                        <React.Fragment key={row.id}>
                                             <tr className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200 group">
                                                  {columns.map((column) => (
                                                       <td
                                                            key={column}
                                                            className="text-zinc-400 group-hover:text-zinc-200 text-xs px-6 py-4 font-mono tracking-wide max-w-xs truncate"
                                                       >
                                                            {renderCell
                                                                 ? renderCell(column, row)
                                                                 : (row[column as keyof T] as React.ReactNode)}
                                                       </td>
                                                  ))}
                                             </tr>
                                             {/* Expanded Row */}
                                             {expandedRowId === row.id && renderExpandedRow && (
                                                  <tr>
                                                       <td colSpan={columns.length} className="bg-zinc-900 border-b border-white/10 p-0">
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
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-white/10 bg-black gap-4">

                         {/* Items Per Page */}
                         <div className="flex items-center gap-3">
                              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Rows per page:</span>
                              <select
                                   className="select select-sm select-bordered w-20 rounded-none bg-black text-white text-xs border-white/20 focus:border-white focus:outline-none"
                                   value={itemsPerPage.toString()}
                                   onChange={(e) => handleItemsPerPageChange(e.target.value)}
                              >
                                   <option value="5">5</option>
                                   <option value="10">10</option>
                                   <option value="25">25</option>
                                   <option value="50">50</option>
                              </select>
                         </div>

                         {/* Actions */}
                         <div className="join rounded-none border border-white/10">
                              <button
                                   className="join-item btn btn-sm btn-ghost rounded-none text-white disabled:bg-transparent disabled:text-zinc-700"
                                   onClick={() => handlePageChange(currentPage - 1)}
                                   disabled={currentPage === 1}
                              >
                                   <ChevronLeftIcon className="h-4 w-4" />
                              </button>

                              {/* Page Info */}
                              <button className="join-item btn btn-sm btn-ghost rounded-none text-xs font-mono no-animation cursor-default hover:bg-transparent text-zinc-400">
                                   Page <span className="text-white mx-1">{currentPage}</span> of {totalPages}
                              </button>

                              <button
                                   className="join-item btn btn-sm btn-ghost rounded-none text-white disabled:bg-transparent disabled:text-zinc-700"
                                   onClick={() => handlePageChange(currentPage + 1)}
                                   disabled={currentPage === totalPages}
                              >
                                   <ChevronRightIcon className="h-4 w-4" />
                              </button>
                         </div>
                    </div>
               )}
          </div>
     );
}