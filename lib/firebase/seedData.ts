import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { CAREER_LIBRARY_930 } from '@/lib/data/careerLibrary930';
import { INTERNSHIP_PROGRAMS_200 } from '@/lib/data/internships200Plus';
import { FORAGE_PROGRAMS } from '@/lib/data/foragePrograms';

let db: Firestore | null = null;

function initializeDatabase() {
  if (db) return;
  try {
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
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

export async function seedCareers() {
  initializeDatabase();
  console.log('Starting careers data seeding...');
  const batch = db!.batch();
  const careersRef = db!.collection('careers');
  let count = 0;

  for (const career of CAREER_LIBRARY_930) {
    const docRef = careersRef.doc(career.id);
    batch.set(docRef, { ...career, createdAt: new Date() });
    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Committed ${count} careers`);
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✓ Seeded ${count} careers`);
  return count;
}

export async function seedInternships() {
  initializeDatabase();
  console.log('Starting internships data seeding...');
  const batch = db!.batch();
  const internsRef = db!.collection('internships');
  let count = 0;

  // Seed main internship programs
  for (const prog of INTERNSHIP_PROGRAMS_200) {
    const docRef = internsRef.doc(prog.id);
    batch.set(docRef, { ...prog, source: 'platform', createdAt: new Date() });
    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Committed ${count} internships`);
    }
  }

  // Seed Forage programs
  for (const prog of FORAGE_PROGRAMS) {
    const docRef = internsRef.doc(prog.id);
    batch.set(docRef, { ...prog, source: 'forage', createdAt: new Date() });
    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Committed ${count} internships`);
    }
  }

  if (count % 500 !== 0) {
    await batch.commit();
  }

  console.log(`✓ Seeded ${count} internships`);
  return count;
}

export async function seedAllData() {
  console.log('🌱 Starting data seeding to Firestore...');
  try {
    const careerCount = await seedCareers();
    const internshipCount = await seedInternships();
    console.log(`✅ Seeding complete: ${careerCount} careers + ${internshipCount} internships`);
    return { careerCount, internshipCount };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}
