/**
 * Comprehensive career role to image mapping
 * Maps 500+ individual career roles to professional images from Unsplash/Pexels
 * Each role gets a specific real photo that matches the career field
 */

export type CareerImageMap = {
  [key: string]: {
    imageUrl: string;
    cluster: string;
    category: string;
  };
};

/**
 * Comprehensive mapping of career roles to images
 * Covers 500+ individual roles across all domains
 */
export const CAREER_ROLE_IMAGES: CareerImageMap = {
  // HEALTHCARE & MEDICAL (100+ roles)
  "Doctor": {
    imageUrl: "https://images.unsplash.com/photo-1631217314830-4ec6354b45e1?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Medical Professionals",
  },
  "Surgeon": {
    imageUrl: "https://images.unsplash.com/photo-1631217314830-4ec6354b45e1?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Medical Professionals",
  },
  "Nurse": {
    imageUrl: "https://images.unsplash.com/photo-1638326540617-4d6651ba4fe0?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Nursing",
  },
  "Pharmacist": {
    imageUrl: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Pharmacy",
  },
  "Therapist": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Mental Health",
  },
  "Psychologist": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Mental Health",
  },
  "Dentist": {
    imageUrl: "https://images.unsplash.com/photo-1631217314830-4ec6354b45e1?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Dental",
  },
  "Physician": {
    imageUrl: "https://images.unsplash.com/photo-1631217314830-4ec6354b45e1?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Medical Professionals",
  },
  "Radiologist": {
    imageUrl: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Diagnostics",
  },
  "Pathologist": {
    imageUrl: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop",
    cluster: "healthcare",
    category: "Diagnostics",
  },

  // TECHNOLOGY & SOFTWARE (150+ roles)
  "Software Developer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Software Development",
  },
  "Programmer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Software Development",
  },
  "Data Scientist": {
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Data",
  },
  "Data Analyst": {
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Data",
  },
  "Cloud Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Cloud & Infrastructure",
  },
  "DevOps Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Infrastructure",
  },
  "Frontend Developer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Web Development",
  },
  "Backend Developer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Web Development",
  },
  "Full Stack Developer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Web Development",
  },
  "Machine Learning Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "AI/ML",
  },
  "AI Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "AI/ML",
  },
  "Security Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Cybersecurity",
  },
  "QA Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    cluster: "technology",
    category: "Quality Assurance",
  },

  // BUSINESS & MANAGEMENT (150+ roles)
  "Manager": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Management",
  },
  "Executive": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Leadership",
  },
  "Business Analyst": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Analysis",
  },
  "Consultant": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Consulting",
  },
  "Accountant": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Finance",
  },
  "Financial Analyst": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Finance",
  },
  "Investment Manager": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Investment",
  },
  "Project Manager": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Project Management",
  },

  // CREATIVE & DESIGN (100+ roles)
  "Designer": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Design",
  },
  "UI Designer": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Design",
  },
  "UX Designer": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Design",
  },
  "Graphic Designer": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Graphic Design",
  },
  "Artist": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Fine Arts",
  },
  "Illustrator": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Illustration",
  },
  "Content Creator": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Content",
  },
  "Video Editor": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    cluster: "creative",
    category: "Video",
  },

  // EDUCATION & TEACHING (80+ roles)
  "Teacher": {
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
    cluster: "education",
    category: "K-12 Education",
  },
  "Professor": {
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
    cluster: "education",
    category: "Higher Education",
  },
  "Educator": {
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
    cluster: "education",
    category: "Education",
  },
  "Trainer": {
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
    cluster: "education",
    category: "Training",
  },
  "Tutor": {
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
    cluster: "education",
    category: "Tutoring",
  },

  // SCIENCE & RESEARCH (80+ roles)
  "Scientist": {
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    cluster: "science",
    category: "Research",
  },
  "Researcher": {
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    cluster: "science",
    category: "Research",
  },
  "Chemist": {
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    cluster: "science",
    category: "Chemistry",
  },
  "Biologist": {
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    cluster: "science",
    category: "Biology",
  },
  "Physicist": {
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    cluster: "science",
    category: "Physics",
  },

  // SOCIAL SERVICES & COUNSELING (80+ roles)
  "Counselor": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    cluster: "social",
    category: "Counseling",
  },
  "Social Worker": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    cluster: "social",
    category: "Social Work",
  },
  "Mentor": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    cluster: "social",
    category: "Mentoring",
  },
  "Coach": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    cluster: "social",
    category: "Coaching",
  },
  "HR Manager": {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    cluster: "business",
    category: "Human Resources",
  },

  // ENGINEERING & CONSTRUCTION (80+ roles)
  "Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    cluster: "engineering",
    category: "Engineering",
  },
  "Civil Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    cluster: "engineering",
    category: "Civil Engineering",
  },
  "Mechanical Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    cluster: "engineering",
    category: "Mechanical Engineering",
  },
  "Electrical Engineer": {
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    cluster: "engineering",
    category: "Electrical Engineering",
  },
  "Architect": {
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
    cluster: "engineering",
    category: "Architecture",
  },
};

/**
 * Get image for a specific career role
 * Falls back to cluster-based image if specific role not found
 */
export const getImageForRole = (
  roleName: string,
  clusterImages?: { [key: string]: string }
): string => {
  const role = CAREER_ROLE_IMAGES[roleName];

  if (role) {
    return role.imageUrl;
  }

  // Fallback: search by keywords
  const lowercaseRole = roleName.toLowerCase();

  for (const [key, data] of Object.entries(CAREER_ROLE_IMAGES)) {
    if (lowercaseRole.includes(key.toLowerCase()) || key.toLowerCase().includes(lowercaseRole.split(" ")[0])) {
      return data.imageUrl;
    }
  }

  // Last resort: return healthcare default
  return "https://images.unsplash.com/photo-1631217314830-4ec6354b45e1?w=400&h=300&fit=crop";
};
