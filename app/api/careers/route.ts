import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore, type Query } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Initialize Firebase Admin SDK
let db: Firestore | undefined;

function initializeFirebase() {
  if (db) return;
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
  db = getFirestore();
}

export async function GET(request: NextRequest) {
  try {
    initializeFirebase();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const cluster = searchParams.get('cluster');
    const search = searchParams.get('search');

    let query: Query = db!.collection('careers');

    if (cluster) {
      query = query.where('cluster', '==', cluster);
    }

    // Get total count
    const snapshot = await query.get();
    const total = snapshot.docs.length;

    // Apply pagination
    let results: any[] = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .slice(offset, offset + limit);

    // Apply text search if provided
    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter(career =>
        career.name?.toLowerCase().includes(lowerSearch) ||
        career.description?.toLowerCase().includes(lowerSearch)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch careers' },
      { status: 500 }
    );
  }
}
