import { db } from "../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Experience } from "@/app/types";

export const getExperiences = async (): Promise<Experience[]> => {
     const querySnapshot = await getDocs(collection(db, "experience"));
     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Experience));
};