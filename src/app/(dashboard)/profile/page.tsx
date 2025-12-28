"use client";

import { useState, useEffect } from "react";
import ProfileForm from "@/components/features/profile/profileForm";
import { getProfile, updateProfile } from "@/lib/service";
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
                    console.error("Failed to fetch portal config:", error);
               } finally {
                    setLoading(false);
               }
          };

          fetchProfile();
     }, []);

     const handleSubmit = async (updatedProfile: Profile) => {
          await updateProfile(updatedProfile);
          setProfile(updatedProfile);
     };

     if (loading) {
          return (
               <div className="space-y-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Portal Configuration</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading Settings...</p>
                    </div>
               </div>
          );
     }

     if (!profile) {
          return (
               <div className="space-y-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Portal Configuration</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">Error Loading Data</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Portal Configuration</h1>
                         <p className="text-zinc-500 text-xs uppercase tracking-widest">System-wide Settings & Preferences</p>
                    </div>
               </div>

               <div className="bg-black border border-white/10 p-6">
                    <ProfileForm
                         initialData={profile}
                         onSubmit={handleSubmit}
                         onCancel={() => window.history.back()}
                    />
               </div>
          </div>
     );
}
