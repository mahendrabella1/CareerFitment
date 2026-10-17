/**
 * Portfolio API - the owner's own portfolio by id (the id is their uid)
 * GET    /api/portfolio/[id]
 * PATCH  /api/portfolio/[id] - same rules as PUT /api/portfolio/my-portfolio
 * DELETE /api/portfolio/[id]
 *
 * Only the owner may use these. Anyone else gets the public page instead
 * (/api/portfolio/public/[slug]), which leaves out private fields.
 */

import { NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase/admin';
import { ApiError, caller, fail } from '@/lib/institution/server';
import { normalisePortfolio, PORTFOLIOS, savePortfolio } from '@/lib/portfolio/server';

export const dynamic = 'force-dynamic';

async function owner(req: Request, id: string) {
  const { uid } = await caller(req);
  if (uid !== id) throw new ApiError(403, 'You can only change your own portfolio.');
  return uid;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const uid = await owner(req, params.id);
    const snap = await (await getFirestore()).collection(PORTFOLIOS).doc(uid).get();
    if (!snap.exists) throw new ApiError(404, 'Portfolio not found');
    return NextResponse.json(normalisePortfolio(snap.data() ?? {}));
  } catch (e) {
    return fail(e);
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const uid = await owner(req, params.id);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    return NextResponse.json(await savePortfolio(await getFirestore(), uid, body));
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const uid = await owner(req, params.id);
    const ref = (await getFirestore()).collection(PORTFOLIOS).doc(uid);
    if (!(await ref.get()).exists) throw new ApiError(404, 'Portfolio not found');
    await ref.delete();
    return NextResponse.json({ message: 'Portfolio deleted successfully' });
  } catch (e) {
    return fail(e);
  }
}
