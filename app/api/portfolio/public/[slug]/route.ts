/**
 * Portfolio API - Public Portfolio View
 * GET /api/portfolio/public/[slug]
 *
 * Gets a public portfolio by slug from Firestore
 * No authentication required (public endpoint)
 * Increments view counter on each access
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

function initFirebase() {
  const apps = getApps();
  if (apps.length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Validate slug format
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid portfolio slug' },
        { status: 400 }
      );
    }

    const db = initFirebase();

    // Query for portfolio by slug
    const querySnapshot = await db.collection('portfolios')
      .where('profileSlug', '==', slug)
      .where('isPublic', '==', true)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Portfolio not found or not public' },
        { status: 404 }
      );
    }

    const portfolioDoc = querySnapshot.docs[0];
    const portfolio = portfolioDoc.data();

    // Increment view counter
    await querySnapshot.docs[0].ref.update({
      views: (portfolio.views || 0) + 1
    });

    // Return only public fields
    const sanitized = {
      profileSlug: portfolio.profileSlug,
      headline: portfolio.headline,
      bio: portfolio.bio,
      location: portfolio.location,
      website: portfolio.website || '',
      linkedin: portfolio.linkedin || '',
      github: portfolio.github || '',
      twitter: portfolio.twitter || '',
      careerFit: portfolio.careerFit || '',
      careerScore: portfolio.careerScore || 0,
      experience: portfolio.experience || [],
      education: portfolio.education || [],
      certifications: portfolio.certifications || [],
      skills: portfolio.skills || [],
      views: (portfolio.views || 0) + 1,
      lastUpdated: portfolio.lastUpdated
    };

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
