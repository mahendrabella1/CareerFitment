import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: messages,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
