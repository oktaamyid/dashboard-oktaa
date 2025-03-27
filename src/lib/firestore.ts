// lib/firestore.ts
import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { Experience, Project, Link } from "@/app/types";


export const getExperiences = async (): Promise<Experience[]> => {
     const querySnapshot = await getDocs(collection(db, "experience"));
     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Experience));
};

export const getProjects = async (): Promise<Project[]> => {
     const querySnapshot = await getDocs(collection(db, "projects"));
     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
};

export const getLinks = async (): Promise<Link[]> => {
     const querySnapshot = await getDocs(collection(db, "links"));

     return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
               id: doc.id,
               originalUrl: data.originalUrl || "",
               shortUrl: data.shortUrl || "",
               createdAt: data.createdAt || new Date().toISOString(),
               clicks: data.clicks || 0,

               // Statistik
               deviceStats: data.deviceStats || { desktop: 0, mobile: 0, tablet: 0 },
               geoStats: data.geoStats || {},
               refererStats: data.refererStats || {},

               // Confirmation Page
               showConfirmationPage: data.showConfirmationPage ?? false,
               confirmationPageSettings: data.confirmationPageSettings || {
                    customMessage: data.customMessage || "",
               }
          } as Link;
     });
};

export const checkShortUrlExists = async (shortUrl: string, excludeId?: string): Promise<boolean> => {
     const q = query(collection(db, "links"), where("shortUrl", "==", shortUrl));
     const querySnapshot = await getDocs(q);

     if (querySnapshot.empty) return false;

     return querySnapshot.docs.some((doc) => doc.id !== excludeId);
};


export const createLink = async (linkData: Omit<Link, "id">) => {
     if (!linkData.shortUrl) throw new Error("Short URL is required");

     const isExists = await checkShortUrlExists(linkData.shortUrl);
     if (isExists) throw new Error("Short URL is already taken");

     const docRef = await addDoc(collection(db, "links"), linkData);
     return { id: docRef.id, ...linkData };
};


export const updateLink = async (id: string, updatedData: Partial<Link>) => {
     if (updatedData.shortUrl) {
          const isExists = await checkShortUrlExists(updatedData.shortUrl, id);
          if (isExists) throw new Error("Short URL is already taken");
     }

     return await updateDoc(doc(db, "links", id), updatedData);
};


export const deleteLink = async (id: string) => {
     return await deleteDoc(doc(db, "links", id));
};