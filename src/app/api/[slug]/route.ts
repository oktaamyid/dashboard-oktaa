import { NextRequest, NextResponse } from "next/server";
import {
     findBySlug,
     updateEndpoint,
     deleteEndpoint
} from "@/lib/service";

// Header CORS global
const corsHeaders = {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
     "Access-Control-Allow-Headers": "Content-Type,Authorization"
};

// Handle OPTIONS (preflight)
export async function OPTIONS() {
     return new NextResponse(null, { headers: corsHeaders });
}

// GET /api/[slug] => return sample data
export async function GET(req: Request, { params }: { params: { slug: string } }) {
     const data = await findBySlug(params.slug);
     if (!data) {
          return NextResponse.json(
               { error: "Not found" },
               { status: 404, headers: corsHeaders }
          );
     }

     const resp: Record<string, unknown> = {};
     for (const f of data.fields) {
          resp[f.fieldName] = f.defaultValue ?? null;
     }
     return NextResponse.json(resp, { headers: corsHeaders });
}

// POST /api/[slug] => validate incoming body
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
     const endpoint = await findBySlug(params.slug);
     if (!endpoint) {
          return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
     }

     const body = await req.json();
     for (const f of endpoint.fields) {
          if (f.required && (body[f.fieldName] === undefined || body[f.fieldName] === "")) {
               return NextResponse.json(
                    { error: `${f.fieldName} required` },
                    { status: 400, headers: corsHeaders }
               );
          }
     }
     return NextResponse.json({ success: true }, { headers: corsHeaders });
}

// PUT /api/[slug]
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
     const endpoint = await findBySlug(params.slug);
     if (!endpoint) {
          return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
     }

     const body = await req.json();
     await updateEndpoint(endpoint.id, body);
     return NextResponse.json({ success: true }, { headers: corsHeaders });
}

// DELETE /api/[slug]
export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
     const endpoint = await findBySlug(params.slug);
     if (!endpoint) {
          return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
     }

     await deleteEndpoint(endpoint.id);
     return NextResponse.json({ success: true }, { headers: corsHeaders });
}
