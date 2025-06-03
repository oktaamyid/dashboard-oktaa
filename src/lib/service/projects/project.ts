import { db } from "../../firebaseConfig";
import { getDocs, collection, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { Project } from "@/app/types";

export const getProjects = async (): Promise<Project[]> => {
     const querySnapshot = await getDocs(collection(db, "projects"));
     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<string> => {
     const docRef = await addDoc(collection(db, 'projects'), project);
     return docRef.id;
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
     await updateDoc(doc(db, 'projects', id), project);
};

export const deleteProject = async (id: string): Promise<void> => {
     await deleteDoc(doc(db, 'projects', id));
};
