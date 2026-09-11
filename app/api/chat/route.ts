import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "AI Chat feature is currently disabled" },
    { status: 503 }
  );
}
