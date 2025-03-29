import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import {
     collection,
     getDocs,
     query,
     where,
     updateDoc,
     increment,
     DocumentReference
} from "firebase/firestore";
import { UAParser } from "ua-parser-js";

interface Params {
     shortUrl?: string;
}

interface LinkData {
     originalUrl: string;
     showConfirmationPage?: boolean;
     confirmationPageSettings?: {
          customMessage?: string;
     };
}

interface AnalyticsUpdates {
     clicks: ReturnType<typeof increment>;
     [key: string]: ReturnType<typeof increment>;
}

export async function GET(request: Request, props: { params: Promise<Params> }) {
     const params = await props.params;
     const shortUrl = params?.shortUrl || "";

     if (!shortUrl) {
          return NextResponse.json({ error: "Invalid short URL" }, { status: 400 });
     }

     try {
          const q = query(collection(db, "links"), where("shortUrl", "==", shortUrl));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
               return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
          }

          const linkDoc = querySnapshot.docs[0];
          const linkData = linkDoc.data() as LinkData;

          await trackAnalytics(request, linkDoc.ref);

          return NextResponse.json({
               originalUrl: linkData.originalUrl,
               showConfirmationPage: linkData.showConfirmationPage ?? false,
               confirmationPageSettings: {
                    customMessage: linkData.confirmationPageSettings?.customMessage ?? ""
               }
          });
     } catch (error) {
          console.error("Error fetching link:", error);
          return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
     }
}

async function trackAnalytics(request: Request, docRef: DocumentReference) {
     try {
          // Get user agent
          const userAgent = request.headers.get("user-agent") || "";
          const parser = new UAParser(userAgent);
          const device = parser.getDevice();

          // Determine device type
          type DeviceType = "mobile" | "tablet" | "desktop";
          let deviceType: DeviceType;
          if (device.type === "mobile") deviceType = "mobile";
          else if (device.type === "tablet") deviceType = "tablet";
          else deviceType = "desktop";

          // Get referrer
          const referer = request.headers.get("referer") || "direct";
          const simplifiedReferer = simplifyReferer(referer);

          // Get country
          const country = request.headers.get("x-vercel-ip-country") ||
               request.headers.get("cf-ipcountry") ||
               "unknown";

          // Build update object with proper typing
          const updates: AnalyticsUpdates = {
               clicks: increment(1),
               [`deviceStats.${deviceType}`]: increment(1),
               [`geoStats.${country}`]: increment(1),
               [`refererStats.${simplifiedReferer}`]: increment(1)
          };

          // Update document
          await updateDoc(docRef, updates);
     } catch (error) {
          console.error("Error tracking analytics:", error);
     }
}

// Simplify referrer to just the domain
function simplifyReferer(referer: string): string {
     try {
          if (referer === "direct") return "direct";
          const url = new URL(referer);
          return url.hostname;
     } catch {
          return "unknown";
     }
}