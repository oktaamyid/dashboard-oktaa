"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { updateProfile } from '@/lib/firestore';

interface ProfileFormProps {
     initialData: Profile;
     onCancel?: () => void;
}

export default function ProfileForm({ initialData, onCancel }: ProfileFormProps) {
     const [formData, setFormData] = useState<Profile>(initialData);
     const [isSubmitting, setIsSubmitting] = useState(false);

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
                         <Input
                              label="Full Name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                         />

                         <Input
                              label="Profile Picture URL"
                              name="profilePicture"
                              type="url"
                              value={formData.profilePicture || ""}
                              onChange={handleChange}
                         />
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