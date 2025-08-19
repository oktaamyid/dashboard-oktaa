import { db } from "@/lib/firebaseConfig";
import {
     collection, addDoc, getDocs, query,
     where, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { ApiEndpoint } from "@/app/types";

const col = collection(db, "api_endpoints");

export async function listEndpoints(): Promise<ApiEndpoint[]> {
     const snap = await getDocs(col);
     return snap.docs.map(d => ({ id: d.id, ...d.data() } as ApiEndpoint));
}

export async function findBySlug(slug: string) {
     const q = query(col, where("slug", "==", slug));
     const snap = await getDocs(q);
     return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() } as ApiEndpoint;
}

export async function createEndpoint(data: Omit<ApiEndpoint, "id">) {
     const ref = await addDoc(col, data);
     return { id: ref.id, ...data };
}

export async function updateEndpoint(id: string, data: Partial<ApiEndpoint>) {
     return updateDoc(doc(col, id), data);
}

export async function deleteEndpoint(id: string): Promise<void> {
     return deleteDoc(doc(col, id));
}
