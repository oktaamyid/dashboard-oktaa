"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Profile } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { updateProfile } from '@/lib/firestore';
import Image from 'next/image';

interface ProfileFormProps {
     initialData: Profile;
     onCancel?: () => void;
}

export default function ProfileForm({ initialData, onCancel }: ProfileFormProps) {
     const [formData, setFormData] = useState<Profile>(initialData);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [previewImage, setPreviewImage] = useState<string | null>(null);
     const fileInputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
          setFormData(initialData);
     }, [initialData]);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;

          // Handle nested socialMedia fields
          if (name.startsWith("socialMedia.")) {
               const field = name.split(".")[1];
               setFormData(prev => ({
                    ...prev,
                    socialMedia: {
                         ...prev.socialMedia,
                         [field]: value
                    }
               }));
          } else {
               setFormData(prev => ({
                    ...prev,
                    [name]: value
               }));
          }
     };

     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;

          // Validasi tipe file
          if (!file.type.startsWith('image/')) {
               alert('Silakan upload file gambar');
               return;
          }

          // Validasi ukuran file (max 2MB)
          if (file.size > 5 * 1024 * 1024) {
               alert('Ukuran file terlalu besar (maksimal 2MB)');
               return;
          }

          // Konversi ke Base64 untuk preview dan simpan sebagai URL data
          const reader = new FileReader();
          reader.onload = () => {
               const base64 = reader.result as string;
               setPreviewImage(base64);
               setFormData(prev => ({
                    ...prev,
                    profilePicture: base64
               }));
          };
          reader.readAsDataURL(file);
     };

     const handleRemoveImage = () => {
          setPreviewImage(null);
          setFormData(prev => ({
               ...prev,
               profilePicture: ""
          }));
          if (fileInputRef.current) {
               fileInputRef.current.value = '';
          }
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);
          try {
               await updateProfile(formData);
               alert("Profile updated successfully!");
          } catch (error) {
               alert("Failed to update profile");
               console.error(error);
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mx-auto">
               <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>

               <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                              <Input
                                   label="Nama Lengkap"
                                   name="name"
                                   required
                                   value={formData.name}
                                   onChange={handleChange}
                              />
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                   Foto Profil
                              </label>
                              <div className="flex items-center space-x-4">
                                   {(previewImage || formData.profilePicture) && (
                                        <div className="relative">
                                             <Image
                                                  src={previewImage || formData.profilePicture || ""}
                                                  alt="Preview"
                                                  width={64}
                                                  height={64}
                                                  className="w-16 h-16 rounded-full object-cover"
                                             />
                                             <button
                                                  type="button"
                                                  onClick={handleRemoveImage}
                                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
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
                                        {(previewImage || formData.profilePicture) ? 'Ganti Foto' : 'Pilih Foto'}
                                   </label>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">Format: JPG/PNG (maks. 5MB)</p>
                         </div>
                    </div>

                    <Input
                         label="Bio"
                         name="bio"
                         value={formData.bio || ""}
                         onChange={handleChange}
                    />

                    <Input
                         label="Website"
                         name="website"
                         type="url"
                         value={formData.website || ""}
                         onChange={handleChange}
                    />

                    <div className="border-t border-gray-600 pt-4">
                         <h3 className="text-lg font-medium text-gray-300 mb-3">Social Media</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                   label="GitHub"
                                   name="socialMedia.github"
                                   type="url"
                                   value={formData.socialMedia?.github || ""}
                                   onChange={handleChange}
                              />
                              <Input
                                   label="LinkedIn"
                                   name="socialMedia.linkedin"
                                   type="url"
                                   value={formData.socialMedia?.linkedin || ""}
                                   onChange={handleChange}
                              />
                              <Input
                                   label="Instagram"
                                   name="socialMedia.instagram"
                                   type="url"
                                   value={formData.socialMedia?.instagram || ""}
                                   onChange={handleChange}
                              />
                              <Input
                                   label="Spotify"
                                   name="socialMedia.spotify"
                                   type="url"
                                   value={formData.socialMedia?.spotify || ""}
                                   onChange={handleChange}
                              />
                              <Input
                                   label="TikTok"
                                   name="socialMedia.tiktok"
                                   type="url"
                                   value={formData.socialMedia?.tiktok || ""}
                                   onChange={handleChange}
                              />
                              <Input
                                   label="Email"
                                   name="socialMedia.mail"
                                   type="email"
                                   value={formData.socialMedia?.mail || ""}
                                   onChange={handleChange}
                              />
                         </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                         <Button
                              type="button"
                              variant="secondary"
                              onClick={onCancel}
                              disabled={isSubmitting}
                         >
                              Cancel
                         </Button>
                         <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Saving..." : "Save Changes"}
                         </Button>
                    </div>
               </form>
          </div>
     );
}