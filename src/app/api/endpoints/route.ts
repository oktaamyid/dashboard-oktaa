import { NextRequest, NextResponse } from 'next/server';
import {
     listEndpoints,
     createEndpoint
} from '@/lib/service';

export async function GET() {
     const data = await listEndpoints();
     return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
     try {
          const body = await req.json();
          const { name, slug, method, fields } = body;

          if (!name || !slug || !method || !Array.isArray(fields)) {
               return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
          }

          const newDoc = await createEndpoint(body);
          return NextResponse.json(newDoc, { status: 201 });
     } catch {
          return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
     }
}
