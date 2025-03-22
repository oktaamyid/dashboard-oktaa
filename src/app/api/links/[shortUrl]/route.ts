import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

interface RouteContext {
     params?: Promise<{ shortUrl?: string }>;
}

export async function GET(req: Request, context: RouteContext) {
     const shortUrl = (await context?.params)?.shortUrl;

     if (!shortUrl) {
          return NextResponse.json({ error: "Invalid short URL" }, { status: 400 });
     }

     try {
          const q = query(collection(db, "links"), where("shortUrl", "==", shortUrl));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
               return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
          }

          const linkData = querySnapshot.docs[0].data();

          return NextResponse.json({
               originalUrl: linkData.originalUrl,
               requireConfirmationPage: linkData.requireConfirmationPage ?? false, // Checkbox saat membuat short URL
               showConfirmationPage: linkData.showConfirmationPage ?? false, 
          });
     } catch (error) {
          console.error("Error fetching link:", error);
          return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
     }
}
