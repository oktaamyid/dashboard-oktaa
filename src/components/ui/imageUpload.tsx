"use client";

import { ChangeEvent, useRef } from "react";
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
     const fileInputRef = useRef<HTMLInputElement>(null);

     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file);
     };

     return (
          <div>
               <label className="block text-sm font-medium text-gray-300 mb-1">
                    Foto Profil
               </label>
               <div className="flex items-center space-x-4">
                    {previewImage && (
                         <div className="relative">
                              <Image
                                   src={previewImage}
                                   alt="Preview"
                                   width={128}
                                   height={128}
                                   className="w-24 h-24 rounded-full object-cover"
                              />
                              <button
                                   type="button"
                                   onClick={onRemoveImage}
                                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 hover:bg-red-600"
                              >
                                   ✕
                              </button>
                         </div>
                    )}
                    <input
                         type="file"
                         ref={fileInputRef}
                         onChange={handleFileChange}
                         accept="image/*"
                         className="hidden"
                         id="profilePicture"
                    />
                    <label
                         htmlFor="profilePicture"
                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition cursor-pointer"
                    >
                         {previewImage ? "Ganti Foto" : "Pilih Foto"}
                    </label>
               </div>
               <p className="text-xs text-gray-400 mt-1">Format: JPG/PNG (maks. 5MB)</p>
          </div>
     );
}