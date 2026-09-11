/**
 * Career cluster images from license-free sources (Unsplash, Pexels)
 * All images are CC0 - completely free to use with or without attribution
 */

export const CAREER_IMAGES = {
  healthcare: {
    title: "Healthcare & Medical",
    images: [
      "https://images.unsplash.com/photo-1631217314830-4ec6354b45e1?w=400&h=300&fit=crop", // Doctor with stethoscope
      "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop", // Hospital/medical
      "https://images.unsplash.com/photo-1638326540617-4d6651ba4fe0?w=400&h=300&fit=crop", // Nurse
    ],
    color: "#4CAF50",
  },
  technology: {
    title: "Technology & Software",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop", // Developer/programmer
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop", // Laptop
      "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop", // Tech workspace
    ],
    color: "#2196F3",
  },
  business: {
    title: "Business & Management",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop", // Business meeting
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop", // Corporate
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop", // Office
    ],
    color: "#FF9800",
  },
  creative: {
    title: "Creative & Design",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop", // Designer/creative
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop", // Art/design
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop", // Creative workspace
    ],
    color: "#E91E63",
  },
  education: {
    title: "Education & Teaching",
    images: [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop", // Teacher/classroom
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop", // Learning
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop", // Education
    ],
    color: "#673AB7",
  },
  science: {
    title: "Science & Research",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop", // Laboratory/scientist
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop", // Research
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop", // Lab
    ],
    color: "#009688",
  },
  social: {
    title: "Social Services & Counseling",
    images: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop", // Counselor/therapist
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop", // People/community
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop", // Support
    ],
    color: "#F44336",
  },
  engineering: {
    title: "Engineering & Construction",
    images: [
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop", // Engineer/construction
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop", // Building/architecture
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop", // Blueprint
    ],
    color: "#795548",
  },
};

/**
 * Get random image from a career cluster
 */
export const getCareerImage = (careerType: keyof typeof CAREER_IMAGES) => {
  const cluster = CAREER_IMAGES[careerType];
  if (!cluster) return CAREER_IMAGES.technology.images[0];
  return cluster.images[Math.floor(Math.random() * cluster.images.length)];
};

/**
 * Map career title to cluster
 */
export const getCareerCluster = (careerTitle: string): keyof typeof CAREER_IMAGES => {
  const title = careerTitle?.toLowerCase() || '';

  if (
    title.includes('doctor') ||
    title.includes('nurse') ||
    title.includes('medical') ||
    title.includes('pharmacist') ||
    title.includes('therapist') ||
    title.includes('physician') ||
    title.includes('surgeon')
  ) {
    return 'healthcare';
  } else if (
    title.includes('software') ||
    title.includes('developer') ||
    title.includes('engineer') ||
    title.includes('programmer') ||
    title.includes('analyst') ||
    title.includes('data') ||
    title.includes('cloud')
  ) {
    return 'technology';
  } else if (
    title.includes('manager') ||
    title.includes('accountant') ||
    title.includes('business') ||
    title.includes('consultant') ||
    title.includes('executive') ||
    title.includes('director') ||
    title.includes('cfo') ||
    title.includes('ceo')
  ) {
    return 'business';
  } else if (
    title.includes('designer') ||
    title.includes('artist') ||
    title.includes('creative') ||
    title.includes('architect') ||
    title.includes('illustrator') ||
    title.includes('ui') ||
    title.includes('ux')
  ) {
    return 'creative';
  } else if (
    title.includes('teacher') ||
    title.includes('professor') ||
    title.includes('educator') ||
    title.includes('instructor') ||
    title.includes('trainer') ||
    title.includes('tutor')
  ) {
    return 'education';
  } else if (
    title.includes('scientist') ||
    title.includes('researcher') ||
    title.includes('chemist') ||
    title.includes('biologist') ||
    title.includes('physicist')
  ) {
    return 'science';
  } else if (
    title.includes('counselor') ||
    title.includes('social') ||
    title.includes('psychologist') ||
    title.includes('therapist') ||
    title.includes('mentor') ||
    title.includes('coach')
  ) {
    return 'social';
  } else if (
    title.includes('civil') ||
    title.includes('mechanical') ||
    title.includes('electrical') ||
    title.includes('architect') ||
    title.includes('builder') ||
    title.includes('contractor')
  ) {
    return 'engineering';
  }

  return 'technology';
};
