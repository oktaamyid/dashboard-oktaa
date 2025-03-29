import { db } from "../../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Project } from "@/app/types";

export const getProjects = async (): Promise<Project[]> => {
     const querySnapshot = await getDocs(collection(db, "projects"));
     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
};