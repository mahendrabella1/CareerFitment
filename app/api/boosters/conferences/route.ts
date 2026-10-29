import { NextResponse } from "next/server";
import { CONFERENCES_FEED, todayIST, upcomingConferences } from "@/lib/boosters/catalog";

export const revalidate = 3600;

/** GET /api/boosters/conferences - OneGrasp's upcoming conferences, from the
 *  events site's own feed, refreshed every hour. */
export async function GET() {
  try {
    const res = await fetch(CONFERENCES_FEED, { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`feed answered ${res.status}`);
    const conferences = upcomingConferences(await res.json(), todayIST());
    return NextResponse.json({ conferences, fetchedAt: Date.now() });
  } catch (e) {
    console.error("[spotlight] conference feed:", e instanceof Error ? e.message : e);
    return NextResponse.json({ conferences: [], error: "The conference list couldn't be loaded just now." }, { status: 502 });
  }
}
