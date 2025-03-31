"use client";

import { useState, useEffect } from "react";
import ProfileForm from "@/components/features/profile/profileForm";
import { getProfile } from "@/lib/service";
import { Profile } from '@/app/types';

export default function EditProfilePage() {
     const [profile, setProfile] = useState<Profile | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchProfile = async () => {
               try {
                    const profileData = await getProfile();
                    setProfile(profileData);
               } catch (error) {
                    console.error("Failed to fetch profile:", error);
               } finally {
                    setLoading(false);
               }
          };

          fetchProfile();
     }, []);

     if (loading) {
          return (
               <div className="flex items-center justify-center h-64">
               </div>
          );
     }

     if (!profile) {
          return (
               <div className="text-center py-10">
                    <p>Profile data not found</p>
               </div>
          );
     }

     return (
          <div className="mx-auto">
               <ProfileForm
                    initialData={profile}
                    onCancel={() => window.history.back()}
               />
          </div>
     );
}