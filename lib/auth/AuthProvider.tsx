"use client";

/**
 * Auth context: wraps the app, tracks the signed-in Firebase user and their
 * Firestore profile, and exposes register / signIn / logout + saveAssessment.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { firebaseReady, getFirebaseAuth, getDb } from "@/lib/firebase/client";

/** Trimmed report saved under the user so the dashboard can render it. */
export interface AssessmentSummary {
  journeyCode: string;
  journeyName: string;
  completedAt: string;
  feedbackRating: number | null;
  overallFitmentPct: number | null;
  topCareer: string | null;
  summary: string | null;
  matches: { title: string; fitmentPct: number; band: string; blurb: string }[];
  topStrengths: { parameterName: string; subTraitName: string; normalizedScore: number }[];
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  status: string; // School student / College student / Working professional / Other
  createdAt?: unknown;
  latestAssessment?: AssessmentSummary;
}

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  status: string;
  password: string;
};

interface AuthState {
  ready: boolean; // firebase configured?
  loading: boolean;
  user: User | null;
  profile: UserProfile | null;
  register: (input: RegisterInput) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  saveAssessment: (summary: AssessmentSummary) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** Map Firebase auth error codes to friendly messages. */
export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try signing in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak — please meet all the rules below.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in isn't enabled in Firebase yet.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return (err as { message?: string })?.message || "Something went wrong. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const db = getDb();
        if (db) {
          try {
            const snap = await getDoc(doc(db, "users", u.uid));
            setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
          } catch {
            setProfile(null);
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function register(input: RegisterInput) {
    const auth = getFirebaseAuth();
    const db = getDb();
    if (!auth || !db) throw new Error("Accounts are not configured yet.");

    const cred = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
    await updateFirebaseProfile(cred.user, { displayName: input.name.trim() });

    const profileDoc: UserProfile = {
      uid: cred.user.uid,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      status: input.status,
    };
    await setDoc(doc(db, "users", cred.user.uid), {
      ...profileDoc,
      createdAt: serverTimestamp(),
    });
    setProfile(profileDoc);
  }

  async function signIn(email: string, password: string) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Accounts are not configured yet.");
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function logout() {
    const auth = getFirebaseAuth();
    if (auth) await signOut(auth);
  }

  async function saveAssessment(summary: AssessmentSummary) {
    const db = getDb();
    if (!db || !user) throw new Error("Not signed in.");
    await setDoc(doc(db, "users", user.uid), { latestAssessment: summary }, { merge: true });
    setProfile((p) => (p ? { ...p, latestAssessment: summary } : p));
  }

  return (
    <AuthContext.Provider
      value={{ ready: firebaseReady, loading, user, profile, register, signIn, logout, saveAssessment }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
