import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase/client';

/**
 * GET /api/assessment/[id]
 * Fetches assessment responses and metadata for generating report
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Initialize Firestore
    const db = getFirestore(app);

    // Fetch assessment document
    const assessmentRef = doc(db, 'assessments', assessmentId);
    const assessmentSnap = await getDoc(assessmentRef);

    if (!assessmentSnap.exists()) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    const assessmentData = assessmentSnap.data();

    // Return assessment data in format expected by scoring engine
    return NextResponse.json({
      id: assessmentId,
      studentName: assessmentData.studentName || 'Student',
      grade: assessmentData.grade || '12',
      responses: {
        personality: assessmentData.personality || {},
        career_interest: assessmentData.careerInterest || {},
        aptitude: assessmentData.aptitude || {},
        strength_domains: assessmentData.strengthDomains || {},
        motivators: assessmentData.motivators || {},
        learning_styles: assessmentData.learningStyles || {},
        emotional_intelligence: assessmentData.emotionalIntelligence || {},
        creativity: assessmentData.creativity || {},
        subject_fit: {
          currentStream: assessmentData.currentStream || 'MPC',
          currentSubjects: assessmentData.currentSubjects || [],
          confidence: assessmentData.subjectConfidence || {}
        },
        career_fit: {
          clarity: assessmentData.careerClarity || 5,
          consideringAreas: assessmentData.consideringAreas || []
        },
        career_selector: {
          primaryCareer: assessmentData.primaryCareer || '',
          alternativeChoices: assessmentData.alternativeChoices || []
        }
      },
      createdAt: assessmentData.createdAt,
      completedAt: assessmentData.completedAt
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment data' },
      { status: 500 }
    );
  }
}
