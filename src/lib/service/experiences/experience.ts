import { db } from "../../firebaseConfig";
import { getDocs, collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Experience } from "@/app/types";

export const getExperiences = async (): Promise<Experience[]> => {
     const querySnapshot = await getDocs(collection(db, "experience"));
     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Experience));
};

export const createExperience = async (experience: Omit<Experience, 'id'>): Promise<string> => {
     const docRef = await addDoc(collection(db, 'experience'), experience);
     return docRef.id;
};

export const updateExperience = async (id: string, experience: Partial<Experience>): Promise<void> => {
     await updateDoc(doc(db, 'experience', id), experience);
};

export const deleteExperience = async (id: string): Promise<void> => {
     await deleteDoc(doc(db, 'experience', id));
};