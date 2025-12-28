"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@/app/types";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import ImageUploader from "@/components/ui/imageUpload";
import FormWrapper from "@/components/ui/form-wrapper";
import { useToast } from "@/components/ui/toast";
import { uploadImage, deleteImage } from "@/lib/service";
import { profileSchema, ProfileFormData } from "@/lib/schemas";
import { useState } from "react";

interface ProfileFormProps {
     initialData?: Profile;
     onSubmit: (data: Profile) => Promise<void>;
     onCancel: () => void;
}

export default function ProfileForm({ initialData, onSubmit, onCancel }: ProfileFormProps) {
     const { showSuccess, showError } = useToast();

     const {
          register,
          handleSubmit,
          setValue,
          watch,
          formState: { errors, isSubmitting },
     } = useForm<ProfileFormData>({
          resolver: zodResolver(profileSchema),
          defaultValues: {
               fullName: initialData?.name || "",
               username: initialData?.username || "",
               email: initialData?.socialMedia?.mail || "",
               bio: initialData?.bio || "",
               avatarUrl: initialData?.profilePicture || "",
               website: initialData?.website || "",
               instagram: initialData?.socialMedia?.instagram || "",
               linkedin: initialData?.socialMedia?.linkedin || "",
               spotify: initialData?.socialMedia?.spotify || "",
               github: initialData?.socialMedia?.github || "",
               tiktok: initialData?.socialMedia?.tiktok || "",
          },
     });

     const avatarUrl = watch("avatarUrl");

     const onFormSubmit = async (data: ProfileFormData) => {
          try {
               // Map form data back to Profile structure
               const profileData: Profile = {
                    ...initialData,
                    // Preserve existing fields
                    id: initialData?.id || "",
                    // Update modified fields
                    name: data.fullName,
                    username: data.username,
                    bio: data.bio,
                    profilePicture: data.avatarUrl,
                    website: data.website,
                    socialMedia: {
                         ...initialData?.socialMedia,
                         mail: data.email,
                         instagram: data.instagram,
                         linkedin: data.linkedin,
                         spotify: data.spotify,
                         github: data.github,
                         tiktok: data.tiktok,
                    }
               };

               await onSubmit(profileData);
               showSuccess("Profile updated successfully");
          } catch (error) {
               console.error(error);
               showError("Failed to save profile");
          }
     };

     const handleImageUpload = async (file: File) => {
          try {
               const { url } = await uploadImage(file);
               setValue("avatarUrl", url, { shouldValidate: true });
               showSuccess("Avatar uploaded");
          } catch (e) {
               showError("Failed to upload avatar");
          }
     };

     const handleImageRemove = async () => {
          const currentUrl = avatarUrl;
          if (currentUrl) {
               // Optimistically update UI
               setValue("avatarUrl", "", { shouldValidate: true });
               try {
                    await deleteImage(currentUrl);
                    showSuccess("Avatar removed");
               } catch (error) {
                    console.error(error);
                    // Optionally revert if delete fails
               }
          }
     };

     return (
          <FormWrapper
               title="Edit Configuration"
               description="Update your personal profile information"
          >
               <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                         <div className="w-full md:w-1/3 flex flex-col items-center">
                              <ImageUploader
                                   previewImage={avatarUrl || null}
                                   onFileChange={handleImageUpload}
                                   onRemoveImage={handleImageRemove}
                              />
                         </div>

                         <div className="w-full md:w-2/3 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <Input
                                        label="Full Name"
                                        {...register("fullName")}
                                        error={errors.fullName?.message}
                                        placeholder="Enter full name"
                                   />
                                   <Input
                                        label="Username"
                                        {...register("username")}
                                        error={errors.username?.message}
                                        placeholder="Enter username"
                                   />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <Input
                                        label="Email Address"
                                        {...register("email")}
                                        error={errors.email?.message}
                                        type="email"
                                        placeholder="name@example.com"
                                   />
                                   <Input
                                        label="Website"
                                        {...register("website")}
                                        error={errors.website?.message}
                                        placeholder="https://yourwebsite.com"
                                   />
                              </div>

                              <div className="space-y-2">
                                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Bio</label>
                                   <textarea
                                        {...register("bio")}
                                        className="w-full bg-black border border-white/10 rounded-none p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors min-h-30 text-sm resize-y"
                                        placeholder="Tell us about yourself..."
                                   />
                                   {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
                              </div>

                              <div className="border-t border-white/10 pt-6 space-y-6">
                                   <h3 className="text-sm font-bold text-white uppercase tracking-wider">Social Media</h3>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                             label="Instagram"
                                             {...register("instagram")}
                                             error={errors.instagram?.message}
                                             placeholder="@username"
                                        />
                                        <Input
                                             label="LinkedIn"
                                             {...register("linkedin")}
                                             error={errors.linkedin?.message}
                                             placeholder="LinkedIn Profile URL"
                                        />
                                        <Input
                                             label="Spotify"
                                             {...register("spotify")}
                                             error={errors.spotify?.message}
                                             placeholder="Spotify Profile URL"
                                        />
                                        <Input
                                             label="GitHub"
                                             {...register("github")}
                                             error={errors.github?.message}
                                             placeholder="GitHub Profile URL"
                                        />
                                        <Input
                                             label="TikTok"
                                             {...register("tiktok")}
                                             error={errors.tiktok?.message}
                                             placeholder="@username"
                                        />
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
                         <Button
                              type="button"
                              variant="secondary"
                              onClick={onCancel}
                              disabled={isSubmitting}
                         >
                              Cancel
                         </Button>
                         <Button type="submit" disabled={isSubmitting} variant="primary">
                              {isSubmitting ? "Saving..." : "Save Profile"}
                         </Button>
                    </div>
               </form>
          </FormWrapper>
     );
}