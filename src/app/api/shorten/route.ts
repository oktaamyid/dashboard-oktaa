import { NextResponse } from "next/server";
import { createLink, checkShortUrlExists } from "@/lib/service";

export async function POST(req: Request) {
     try {
          const { originalUrl, shortUrl, showConfirmationPage, confirmationPageSettings } = await req.json();
          if (!originalUrl || !shortUrl) {
               return NextResponse.json({ error: "Missing originalUrl or shortUrl" }, { status: 400 });
          }

          const isExists = await checkShortUrlExists(shortUrl);
          if (isExists) {
               return NextResponse.json({ error: "Short URL is already taken" }, { status: 400 });
          }

          const newLink = await createLink({ originalUrl, shortUrl, showConfirmationPage, confirmationPageSettings });

          return NextResponse.json(newLink, { status: 201 });
     } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Something went wrong";
          return NextResponse.json({ error: errorMessage }, { status: 500 });
     }
}
