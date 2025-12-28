"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
     previewImage: string | null;
     onFileChange: (file: File) => void;
     onRemoveImage: () => void;
}

export default function ImageUploader({
     previewImage,
     onFileChange,
     onRemoveImage,
}: ImageUploaderProps) {

     const [isDragging, setIsDragging] = useState(false);
     const fileInputRef = useRef<HTMLInputElement>(null);

     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file);
     };

     const handleDragOver = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(true);
     };

     const handleDragLeave = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
     };

     const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith("image/")) {
               onFileChange(file);
          }
     };

     return (
          <div className="form-control w-full">
               <label className="label pb-1">
                    <span className="label-text text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Profile Picture</span>
               </label>

               <div
                    className={`
                         relative flex gap-6 items-start p-4 border border-dashed transition-all duration-200
                         ${isDragging ? 'border-white bg-white/10' : 'border-transparent'}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
               >
                    {/* Preview Square */}
                    <div className="relative group shrink-0 w-24 h-24 bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                         {previewImage ? (
                              <>
                                   <Image
                                        src={previewImage}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                   />
                                   <button
                                        type="button"
                                        onClick={onRemoveImage}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity"
                                   >
                                        REMOVE
                                   </button>
                              </>
                         ) : (
                              <span className="text-zinc-700 text-xs uppercase text-center p-2">
                                   {isDragging ? "Drop Here" : "No Image"}
                              </span>
                         )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-2 w-full">
                         <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="file-input file-input-bordered file-input-sm w-full rounded-none bg-black text-white border-white/20 focus:outline-none"
                         />
                         <div className="text-[10px] text-zinc-500 uppercase tracking-wide">
                              {isDragging ? "Drop image to upload" : "Supports JPG/PNG. Max 5MB. Drag & Drop supported."}
                         </div>
                    </div>
               </div>
          </div>
     );
}