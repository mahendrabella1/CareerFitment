import { NextRequest, NextResponse } from "next/server";

// This API route is temporarily disabled for server-side Firestore access
// The client will handle registration directly via "use client" components

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "API temporarily disabled - use client-side components" },
    { status: 503 }
  );
}
