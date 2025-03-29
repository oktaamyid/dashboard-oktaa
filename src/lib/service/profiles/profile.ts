import { db } from "../../firebaseConfig";
import { updateDoc, doc, serverTimestamp, getDocs, collection } from "firebase/firestore";
import { Profile } from "@/app/types";

const PROFILE_ID = "Z1EYXQESzJttuFME0wuT";

export const getProfiles = async (): Promise<Profile[]> => {
     const querySnapshot = await getDocs(collection(db, "profile"));
     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Profile));
}

export const updateProfile = async (updatedData: Partial<Profile>) => {
     if (!updatedData.id) throw new Error("Profile ID is required");
     return await updateDoc(doc(db, "profile", PROFILE_ID), {
          ...updatedData,
          updatedAt: serverTimestamp(),
     });
};