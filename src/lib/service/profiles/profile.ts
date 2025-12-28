import { db } from "../../firebaseConfig";
import { updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { Profile } from "@/app/types";

const PROFILE_COLLECTION = "profile";
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

          await updateDoc(doc(db, PROFILE_COLLECTION, PROFILE_ID), {
               ...updatedData,
               updatedAt: serverTimestamp(),
          });

     } catch (error) {
          console.error("Error in updateProfile:", error);
          throw new Error(typeof error === 'string' ? error : "Failed to update profile");
     }
};