import { NextRequest, NextResponse } from "next/server";
import {
     findBySlug,
     updateEndpoint,
     deleteEndpoint
} from "@/lib/service";

// GET /api/[slug]  => return sample response (defaultValue)
export async function GET(req: Request, props: { params: Promise<{ slug: string }> }) {
     const params = await props.params;
     const data = await findBySlug(params.slug);
     if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

     const resp: Record<string, unknown> = {};
     for (const f of data.fields) {
          resp[f.fieldName] = f.defaultValue ?? null;
     }
     return NextResponse.json(resp);
}

// POST /api/[slug]  => validate body
export async function POST(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
     const params = await props.params;
     const endpoint = await findBySlug(params.slug);
     if (!endpoint) return NextResponse.json({ error: "Not found" }, { status: 404 });

     const body = await req.json();
     for (const f of endpoint.fields) {
          if (f.required && (body[f.fieldName] === undefined || body[f.fieldName] === "")) {
               return NextResponse.json({ error: `${f.fieldName} required` }, { status: 400 });
          }
     }
     return NextResponse.json({ success: true });
}

// PUT /api/[slug]  => update fields config
export async function PUT(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
     const params = await props.params;
     const endpoint = await findBySlug(params.slug);
     if (!endpoint) return NextResponse.json({ error: "Not found" }, { status: 404 });

     const body = await req.json();
     await updateEndpoint(endpoint.id, body);
     return NextResponse.json({ success: true });
}

// DELETE /api/[slug]  => delete by slug
export async function DELETE(req: Request, props: { params: Promise<{ slug: string }> }) {
     const params = await props.params;
     const endpoint = await findBySlug(params.slug);
     if (!endpoint) return NextResponse.json({ error: "Not found" }, { status: 404 });

     await deleteEndpoint(endpoint.id);
     return NextResponse.json({ success: true });
}
