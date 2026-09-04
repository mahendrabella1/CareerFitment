/**
 * Portfolio API - Get User's Portfolio
 * GET /api/portfolio/my-portfolio
 *
 * Returns the current user's portfolio profile from Firestore
 * Requires authentication
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

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication - extract userId from session/token
    // For now, use a demo user ID from query params or headers
    const userId = request.headers.get('x-user-id') || 'demo-user-123';

    const db = initFirebase();
    const portfolioRef = db.collection('portfolios').doc(userId);
    const portfolio = await portfolioRef.get();

    if (!portfolio.exists) {
      // Return empty portfolio template for new users
      return NextResponse.json({
        userId,
        profileSlug: '',
        headline: '',
        bio: '',
        location: '',
        website: '',
        email: '',
        experience: [],
        education: [],
        certifications: [],
        skills: [],
        isPublic: false,
        views: 0,
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        showEmail: false,
        showPhone: false,
        showCareerScore: true
      });
    }

    return NextResponse.json(portfolio.data());
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
