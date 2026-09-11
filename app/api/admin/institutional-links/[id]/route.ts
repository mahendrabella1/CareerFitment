import { NextRequest, NextResponse } from "next/server";

// These API routes are temporarily disabled for server-side Firestore access
// The client will handle Firestore operations directly via "use client" components

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: "API temporarily disabled - use client-side components" },
    { status: 503 }
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(
    { error: "API temporarily disabled - use client-side components" },
    { status: 503 }
  );
}
