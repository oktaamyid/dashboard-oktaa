import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where, updateDoc, doc, increment } from "firebase/firestore";
import { detect } from "detect-browser";
import { IP2Location } from 'ip2location-nodejs';

const ip2loc = new IP2Location();

ip2loc.open('../../../../../IP2LOCATION-LITE-DB11.BIN');

interface Params {
     shortUrl?: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
     const shortUrl = (params?.shortUrl) || "";

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
          const linkData = linkDoc.data();

          // Device detection
          const userAgent = request.headers.get("user-agent") || "";
          const browser = detect(userAgent);
          const deviceType = browser?.os?.toLowerCase().includes("mobile")
               ? "Mobile"
               : browser?.os?.toLowerCase().includes("tablet")
                    ? "Tablet"
                    : "Desktop";

          // IP2Location lookup
          const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "8.8.8.8";
          let location = "Unknown";

          try {
               const geo = ip2loc.getAll(ip);
               if (geo.countryLong) {
                    location = geo.city
                         ? `${geo.city}, ${geo.countryLong}`
                         : geo.countryLong;
               }
          } catch (geoErr) {
               console.error('IP2Location lookup error:', geoErr);
          }

          // Referrer detection
          const referrer = request.headers.get("referer") || "Direct";

          // Update Firestore with analytics
          await updateDoc(doc(db, "links", linkDoc.id), {
               clicks: increment(1),
               [`deviceStats.${deviceType}`]: increment(1),
               [`geoStats.${location}`]: increment(1),
               [`referrerStats.${referrer}`]: increment(1),
          });

          return NextResponse.json({
               originalUrl: linkData.originalUrl,
               showConfirmationPage: linkData.showConfirmationPage ?? false,
               confirmationPageSettings: {
                    customMessage: linkData.confirmationPageSettings?.customMessage ?? "",
               },
          });
     } catch (error) {
          console.error("Error fetching link:", error);
          return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 });
     }
}