/**
 * Portfolio API - Public Portfolio View
 * GET /api/portfolio/public/[slug]
 *
 * A portfolio its owner has made public, by slug. No sign-in needed. Counts
 * one view per call and returns only what the owner chose to show.
 */

import { NextResponse } from 'next/server';
import { getFirestore, isFirestoreConfigured } from '@/lib/firebase/admin';
import { normalisePortfolio, PORTFOLIOS } from '@/lib/portfolio/server';

export const dynamic = 'force-dynamic';

const SLUG = /^[a-z0-9-]{3,80}$/;

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    if (!SLUG.test(params.slug ?? '')) {
      return NextResponse.json({ error: 'Invalid portfolio link' }, { status: 400 });
    }
    if (!isFirestoreConfigured()) {
      return NextResponse.json({ error: 'Portfolios are not available on this deployment.' }, { status: 503 });
    }
    const db = await getFirestore();
    const found = await db.collection(PORTFOLIOS)
      .where('profileSlug', '==', params.slug)
      .where('isPublic', '==', true)
      .limit(1)
      .get();
    if (found.empty) {
      return NextResponse.json({ error: 'Portfolio not found or not public' }, { status: 404 });
    }

    const doc = found.docs[0];
    const p = normalisePortfolio(doc.data());
    await doc.ref.update({ views: p.views + 1 });

    return NextResponse.json({
      profileSlug: p.profileSlug,
      displayName: p.displayName || '',
      headline: p.headline,
      bio: p.bio,
      location: p.location || '',
      website: p.website || '',
      linkedin: p.linkedin || '',
      github: p.github || '',
      twitter: p.twitter || '',
      careerFit: p.careerFit || '',
      ...(p.showCareerScore && p.careerScore ? { careerScore: p.careerScore } : {}),
      ...(p.showEmail && p.email ? { email: p.email, showEmail: true } : {}),
      ...(p.showPhone && p.phone ? { phone: p.phone, showPhone: true } : {}),
      experience: p.experience,
      education: p.education,
      certifications: p.certifications,
      skills: p.skills,
      views: p.views + 1,
      lastUpdated: p.lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}
