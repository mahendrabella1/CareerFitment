/**
 * Portfolio API - Create New Portfolio
 * POST /api/portfolio/create
 *
 * Creates a new portfolio for the user in Firestore
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

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user-123'; // TODO: Get from auth
    const body = await request.json();
    const { headline, bio, location } = body;

    // Validate required fields
    if (!headline || !bio) {
      return NextResponse.json(
        { error: 'Headline and bio are required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const slug = headline
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50) + '-' + Date.now();

    const db = initFirebase();
    const newPortfolio = {
      userId,
      profileSlug: slug,
      headline,
      bio,
      location: location || '',
      website: '',
      email: '',
      experience: [],
      education: [],
      certifications: [],
      skills: [],
      isPublic: false,
      shareToken: Math.random().toString(36).substring(2, 15),
      views: 0,
      lastUpdated: new Date(),
      createdAt: new Date(),
      showEmail: false,
      showPhone: false,
      showCareerScore: true
    };

    // Save to Firestore
    await db.collection('portfolios').doc(userId).set(newPortfolio);

    return NextResponse.json(newPortfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
