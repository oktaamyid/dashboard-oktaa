import { db } from "../../firebaseConfig";
import { updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { Profile } from "@/app/types";
import { deleteFromBlob, uploadToBlob } from "@/lib/utils/blob";

const PROFILE_COLLECTION = "profile"; // atau "profiles" - pilih satu dan konsisten
const PROFILE_ID = "Z1EYXQESzJttuFME0wuT";

export async function getProfile(): Promise<Profile | null> {
     try {
          const profileRef = doc(db, PROFILE_COLLECTION, PROFILE_ID);
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
               return { id: profileSnap.id, ...profileSnap.data() } as Profile;
          }
          return null;
     } catch (error) {
          console.error("Error getting profile:", error);
          throw new Error("Failed to fetch profile");
     }
}

export const updateProfile = async (updatedData: Partial<Profile>): Promise<void> => {
     try {
          // Validasi input
          if (!updatedData || typeof updatedData !== 'object') {
               throw new Error('Invalid update data');
          }

          const currentProfile = await getProfile();
          const oldImageUrl = currentProfile?.profilePicture;

          // Fungsi untuk memvalidasi URL Blob
          const isVercelBlobUrl = (url: string) => {
               try {
                    const parsedUrl = new URL(url);
                    return parsedUrl.hostname.endsWith('.vercel-storage.com') ||
                         parsedUrl.hostname.includes('vercel-blob.com');
               } catch {
                    return false;
               }
          };

          // Handle profile picture update
          if (updatedData.profilePicture) {
               if (updatedData.profilePicture.startsWith('data:image')) {
                    try {
                         // Upload gambar baru
                         const contentType = updatedData.profilePicture.split(';')[0].split(':')[1];
                         const blobResult = await uploadToBlob(updatedData.profilePicture, contentType);
                         updatedData.profilePicture = blobResult.url;

                         // Hapus gambar lama jika ada dan berbeda
                         if (oldImageUrl && oldImageUrl !== updatedData.profilePicture && isVercelBlobUrl(oldImageUrl)) {
                              await deleteFromBlob(oldImageUrl)
                                   .then(() => console.log("Old image deleted successfully"))
                                   .catch((error) => console.error("Error deleting old image:", error));
                         }
                    } catch (error) {
                         console.error("Error uploading new profile picture:", error);
                         throw new Error("Failed to upload new profile picture");
                    }
               } else if (updatedData.profilePicture === "") {

                    // Handle penghapusan gambar profil
                    updatedData.profilePicture = ""; 

                    if (oldImageUrl && isVercelBlobUrl(oldImageUrl)) {
                         try {
                              await deleteFromBlob(oldImageUrl);
                              console.log(`Deleted old image: ${oldImageUrl}`);
                         } catch (error) {
                              console.error('Deletion error but continuing:', error);
                         }
                    }
               }
          }

          await updateDoc(doc(db, PROFILE_COLLECTION, PROFILE_ID), {
               ...updatedData,
               updatedAt: serverTimestamp(),
          });

     } catch (error) {
          console.error("Error in updateProfile:", error);
          throw new Error(typeof error === 'string' ? error : "Failed to update profile");
     }
};