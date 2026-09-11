/**
 * Portfolio API - Get/Update/Delete Portfolio
 * GET /api/portfolio/[id] - Get portfolio by ID
 * PATCH /api/portfolio/[id] - Update portfolio
 * DELETE /api/portfolio/[id] - Delete portfolio
 *
 * Uses Firestore for persistence
 * Requires authentication for updates/deletes
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
  { params }: { params: { id: string } }
) {
  try {
    const db = initFirebase();
    const portfolioRef = db.collection('portfolios').doc(params.id);
    const portfolio = await portfolioRef.get();

    if (!portfolio.exists) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || params.id; // TODO: Add auth check
    const body = await request.json();

    const db = initFirebase();
    const portfolioRef = db.collection('portfolios').doc(params.id);

    // Update with new data and lastUpdated timestamp
    const updateData = {
      ...body,
      lastUpdated: new Date()
    };

    await portfolioRef.update(updateData);

    // Return updated portfolio
    const updatedDoc = await portfolioRef.get();
    return NextResponse.json(updatedDoc.data());
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || params.id; // TODO: Add auth check

    const db = initFirebase();
    const portfolioRef = db.collection('portfolios').doc(params.id);

    // Check if exists
    const portfolio = await portfolioRef.get();
    if (!portfolio.exists) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Delete the portfolio
    await portfolioRef.delete();

    return NextResponse.json(
      { message: 'Portfolio deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
