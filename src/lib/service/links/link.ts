import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, serverTimestamp, Timestamp } from "firebase/firestore";
import { Link } from "@/app/types";
import { format } from 'date-fns';

export const getLinks = async (): Promise<Link[]> => {
     const querySnapshot = await getDocs(collection(db, "links"));
     return querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
               id: doc.id,
               ...data,
               createdAt: data.createdAt instanceof Timestamp
                    ? format(data.createdAt.toDate(), "dd MMM yyyy HH:mm:ss")
                    : data.createdAt,
               updatedAt: data.updatedAt instanceof Timestamp
                    ? format(data.updatedAt.toDate(), "dd MMM yyyy HH:mm:ss")
                    : data.updatedAt,
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
     const docRef = await addDoc(collection(db, "links"), {
          ...linkData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
     });
     return { id: docRef.id, ...linkData, createdAt: new Date(), updatedAt: new Date() };
};

export const updateLink = async (id: string, updatedData: Partial<Link>) => {
     if (updatedData.shortUrl) {
          const isExists = await checkShortUrlExists(updatedData.shortUrl, id);
          if (isExists) throw new Error("Short URL is already taken");
     }
     return await updateDoc(doc(db, "links", id), {
          ...updatedData,
          updatedAt: serverTimestamp(),
     });
};

export const deleteLink = async (id: string) => {
     return await deleteDoc(doc(db, "links", id));
};