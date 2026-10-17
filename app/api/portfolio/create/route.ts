/**
 * Portfolio API - Create New Portfolio
 * POST /api/portfolio/create  { headline, bio, location?, displayName? }
 *
 * Kept for older clients; the same save as PUT /api/portfolio/my-portfolio.
 * Never overwrites an existing portfolio - a second call only updates the
 * fields it sends.
 */

import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase/admin';
import { caller, fail } from '@/lib/institution/server';
import { savePortfolio } from '@/lib/portfolio/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const portfolio = await savePortfolio(await getFirestore(), uid, body);
    return NextResponse.json(portfolio, { status: 201 });
  } catch (e) {
    return fail(e);
  }
}
