/**
 * Portfolio API - the signed-in student's own portfolio
 * GET /api/portfolio/my-portfolio  { portfolio } - null until they create one
 * PUT /api/portfolio/my-portfolio  save the fields sent (creates it on the
 *     first save; see lib/portfolio/server.ts for what may be set)
 *
 * The caller is identified by their Firebase ID token ("Authorization:
 * Bearer"), never by a client-supplied user id.
 */

import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase/admin';
import { caller, fail } from '@/lib/institution/server';
import { normalisePortfolio, PORTFOLIOS, savePortfolio } from '@/lib/portfolio/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { uid } = await caller(req);
    const db = await getFirestore();
    const snap = await db.collection(PORTFOLIOS).doc(uid).get();
    return NextResponse.json({ portfolio: snap.exists ? normalisePortfolio(snap.data() ?? {}) : null });
  } catch (e) {
    return fail(e);
  }
}

export async function PUT(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const portfolio = await savePortfolio(await getFirestore(), uid, body);
    return NextResponse.json({ portfolio });
  } catch (e) {
    return fail(e);
  }
}
