import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, writeBatch } from 'firebase-admin/firestore';
import { CAREER_LIBRARY_930 } from '@/lib/data/careerLibrary930';
import { INTERNSHIP_PROGRAMS_200 } from '@/lib/data/internships200Plus';
import { FORAGE_PROGRAMS } from '@/lib/data/foragePrograms';

const apps = getApps();
let db;

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

export async function seedCareers() {
  console.log('Starting careers data seeding...');
  const batch = writeBatch(db);
  const careersRef = db.collection('careers');
  let count = 0;

  for (const career of CAREER_LIBRARY_930) {
    const docRef = careersRef.doc(career.id);
    batch.set(docRef, {
      id: career.id,
      name: career.name,
      cluster: career.cluster,
      overview: career.overview,
      whatYouWillDo: career.whatYouWillDo,
      skills: career.skills,
      education: career.education,
      certifications: career.certifications,
      prerequisites: career.prerequisites,
      tools: career.tools,
      companies: career.companies,
      industries: career.industries,
      demand: career.demand,
      salaryINR: {
        entry: career.salaryINREntry,
        mid: career.salaryINRMid,
      },
      salaryUSD: {
        entry: career.salaryUSDEntry,
        mid: career.salaryUSDMid,
      },
      growth: career.growth,
      future: career.future,
      createdAt: new Date(),
    });
    count++;

    // Firestore batch write limit is 500
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
  console.log('Starting internships data seeding...');
  const batch = writeBatch(db);
  const internsRef = db.collection('internships');
  let count = 0;

  // Seed main internship programs
  for (const prog of INTERNSHIP_PROGRAMS_200) {
    const docRef = internsRef.doc(prog.id);
    batch.set(docRef, {
      id: prog.id,
      company: prog.company,
      title: prog.title,
      description: prog.description,
      overview: prog.overview,
      skillsGained: prog.skillsGained,
      difficulty: prog.difficulty,
      duration: prog.duration,
      industry: prog.industry,
      rating: prog.rating,
      reviews: prog.reviews,
      verified: prog.verified,
      url: prog.url,
      source: 'platform',
      createdAt: new Date(),
    });
    count++;

    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Committed ${count} internships`);
    }
  }

  // Seed Forage programs
  for (const prog of FORAGE_PROGRAMS) {
    const docRef = internsRef.doc(prog.id);
    batch.set(docRef, {
      id: prog.id,
      company: prog.company,
      title: prog.title,
      category: prog.category,
      overview: `Free ${prog.category} program from ${prog.company}. Duration: ${prog.duration}. Difficulty: ${prog.difficulty}.`,
      skillsGained: prog.skills,
      difficulty: prog.difficulty,
      duration: prog.duration,
      industry: prog.industry,
      rating: prog.rating,
      reviews: prog.reviews,
      verified: true,
      url: prog.url,
      source: 'forage',
      createdAt: new Date(),
    });
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
