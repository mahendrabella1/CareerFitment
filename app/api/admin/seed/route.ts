import { NextRequest, NextResponse } from 'next/server';
import { seedAllData } from '@/lib/firebase/seedData';

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - replace with proper auth in production
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_SEED_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await seedAllData();

    return NextResponse.json({
      success: true,
      message: 'Data seeded successfully',
      result,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Seeding failed',
      },
      { status: 500 }
    );
  }
}
