import { db } from "../../firebaseConfig";
import {
     collection,
     doc,
     addDoc,
     getDocs,
     getDoc,
     updateDoc,
     deleteDoc,
     serverTimestamp,
     QueryDocumentSnapshot,
     where,
     query,
     Timestamp,
     writeBatch
} from "firebase/firestore";
import { Link } from "@/app/types";
import { format } from 'date-fns';
import { formatShortUrl, validateShortUrl } from "@/lib/utils/formatUrl";

// Convert Firestore document to Link type
const convertDoc = (doc: QueryDocumentSnapshot): Link => {
     const data = doc.data();
     return {
          id: doc.id,
          originalUrl: data.originalUrl,
          shortUrl: data.shortUrl,
          multipleUrls: data.multipleUrls || [],
          useMultipleUrls: data.useMultipleUrls || false,
          createdAt: data.createdAt instanceof Timestamp
               ? format(data.createdAt.toDate(), "dd MMM yyyy HH:mm:ss")
               : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp
               ? format(data.updatedAt.toDate(), "dd MMM yyyy HH:mm:ss")
               : data.updatedAt,
          clicks: data.clicks || 0,
          showToPortal: data.showToPortal || false,
          isPinned: data.isPinned || false,
          nameUrl: data.nameUrl || "",
          category: data.category || "",
          description: data.description || "",
          price: data.price || 0, // Include price
          deviceStats: data.deviceStats || {},
          browserStats: data.browserStats || {},
          geoStats: data.geoStats || {},
          refererStats: data.refererStats || {},
          showConfirmationPage: data.showConfirmationPage || false,
          confirmationPageSettings: data.confirmationPageSettings || {},
     };
};

// Get all links
export const getLinks = async (): Promise<Link[]> => {
     const querySnapshot = await getDocs(collection(db, "links"));
     return querySnapshot.docs.map(convertDoc);
};

export const checkShortUrlExists = async (shortUrl: string, excludeId?: string): Promise<boolean> => {
     const q = query(collection(db, "links"), where("shortUrl", "==", shortUrl));
     const querySnapshot = await getDocs(q);
     if (querySnapshot.empty) return false;
     return querySnapshot.docs.some((doc) => doc.id !== excludeId);
};

// Create a new link
export const createLink = async (linkData: Omit<Link, "id">): Promise<{ id: string }> => {
     const now = serverTimestamp();

     // Format short URL
     const formattedShortUrl = formatShortUrl(linkData.shortUrl || '');

     if (!validateShortUrl(formattedShortUrl)) {
          throw new Error('Short URL contains invalid characters');
     }

     // Check if short URL exists
     const isExists = await checkShortUrlExists(formattedShortUrl);

     if (isExists) {
          throw new Error('Short URL is already exists.');
     }

     // Initialize analytics fields
     const dataToSave = {
          ...linkData,
          shortUrl: formattedShortUrl,
          createdAt: now,
          updatedAt: now,
          clicks: 0,
          deviceStats: {
               desktop: 0,
               mobile: 0,
               tablet: 0
          },
          geoStats: {},
          refererStats: {},
          multipleUrls: linkData.multipleUrls || [],
          useMultipleUrls: linkData.useMultipleUrls || false,
          price: linkData.price || 0
     };

     const docRef = await addDoc(collection(db, "links"), dataToSave);
     return { id: docRef.id };
};

// Update an existing link
export const updateLink = async (id: string, linkData: Partial<Omit<Link, "id">>): Promise<void> => {

     if (linkData.shortUrl) {
          const formattedShortUrl = formatShortUrl(linkData.shortUrl);

          if (!validateShortUrl(formattedShortUrl)) {
               throw new Error('Short URL contains invalid characters');
          }

          // Check if short URL exists (excluding current doc)
          const exists = await checkShortUrlExists(formattedShortUrl, id);
          if (exists) {
               throw new Error('Short URL already exists');
          }

          linkData.shortUrl = formattedShortUrl;
     }

     const docRef = doc(db, "links", id);
     await updateDoc(docRef, {
          ...linkData,
          updatedAt: serverTimestamp()
     });
};

// Delete a link
export const deleteLink = async (id: string): Promise<void> => {
     await deleteDoc(doc(db, "links", id));
};

// Get a single link
export const getLink = async (id: string): Promise<Link | null> => {
     const docRef = doc(db, "links", id);
     const docSnap = await getDoc(docRef);

     if (docSnap.exists()) {
          return {
               id: docSnap.id,
               ...docSnap.data()
          } as Link;
     }

     return null;
};

// Get a link by short URL
export const getLinkByShortUrl = async (shortUrl: string): Promise<Link | null> => {
     // Ensure incoming short URL uses the same format stored in Firestore
     const formattedShortUrl = formatShortUrl(shortUrl);

     // If the short URL contains invalid characters, simply return null
     if (!validateShortUrl(formattedShortUrl)) {
          return null;
     }

     // Query Firestore for a document with matching shortUrl field
     const linksRef = collection(db, "links");
     const q = query(linksRef, where("shortUrl", "==", formattedShortUrl));
     const querySnapshot = await getDocs(q);

     if (!querySnapshot.empty) {
          return convertDoc(querySnapshot.docs[0]);
     }

     return null;
};

export const resetLinkAnalytics = async (): Promise<void> => {
     try {
          const linksCollection = collection(db, "links");
          const querySnapshot = await getDocs(linksCollection);
          const batch = writeBatch(db);

          querySnapshot.docs.forEach((docSnapshot) => {
               const linkRef = doc(db, "links", docSnapshot.id);
               batch.update(linkRef, {
                    clicks: 0,
                    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
                    browserStats: {},
                    geoStats: {},
                    refererStats: {}
               });
          });

          await batch.commit();
          console.log("Successfully reset analytics for all links.");
     } catch (error) {
          console.error("Error resetting link analytics: ", error);
          throw new Error("Failed to reset link analytics");
     }
};