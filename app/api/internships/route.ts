import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, type Firestore, type Query } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

const apps = getApps();
let db: Firestore | undefined;

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    let query: Query = db!.collection('internships');

    if (category) {
      query = query.where('category', '==', category);
    }

    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }

    // Get results
    const snapshot = await query.get();
    const total = snapshot.docs.length;

    let results: any[] = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .slice(offset, offset + limit);

    // Apply text search if provided
    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter(prog =>
        prog.title?.toLowerCase().includes(lowerSearch) ||
        prog.company?.toLowerCase().includes(lowerSearch) ||
        prog.overview?.toLowerCase().includes(lowerSearch)
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
    console.error('Error fetching internships:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch internships' },
      { status: 500 }
    );
  }
}
