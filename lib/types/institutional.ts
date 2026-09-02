/** Institutional Link Management */

export interface InstitutionalLink {
  id: string;
  code: string; // Unique code for the link (e.g., "SCHOOL-2024-ABC123")
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolCity: string;
  schoolState: string;
  status: "active" | "inactive" | "expired";
  createdAt: string;
  expiresAt: string | null; // null = never expires
  maxStudents?: number; // optional limit
  usedCount: number; // how many students have registered
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  originalPrice: number; // ₹5,999 displayed to student
  institutionPrice: number; // discounted rate paid by institution (hidden)
  notes?: string;
}

export interface InstitutionalStudent {
  id: string;
  linkId: string; // reference to InstitutionalLink
  userId: string; // Firebase user ID
  email: string;
  name: string;
  phone: string;
  class: string;
  schoolName: string;
  registeredAt: string;
  completedAt?: string;
  assessmentSessionId?: string;
  reportSent: boolean;
}

export interface InstitutionalDashboardStats {
  totalStudents: number;
  completedAssessments: number;
  pendingAssessments: number;
  reportsGenerated: number;
  lastUpdated: string;
}
