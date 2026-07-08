"use client";

/**
 * Auth context: wraps the app, tracks the signed-in Firebase user and their
 * Firestore profile, and exposes register / signIn / signOut helpers.
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

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  institution: string;
  classLevel: string; // MILESTONE value, e.g. "career_planning"
  status: string; // School student / College student / Working professional / Other
  createdAt?: unknown;
}

export type RegisterInput = Omit<UserProfile, "uid" | "createdAt"> & {
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
          const snap = await getDoc(doc(db, "users", u.uid));
          setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
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

    const cred = await createUserWithEmailAndPassword(
      auth,
      input.email.trim(),
      input.password
    );
    await updateFirebaseProfile(cred.user, { displayName: input.name.trim() });

    const profileDoc: UserProfile = {
      uid: cred.user.uid,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      city: input.city.trim(),
      institution: input.institution.trim(),
      classLevel: input.classLevel,
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

  return (
    <AuthContext.Provider
      value={{ ready: firebaseReady, loading, user, profile, register, signIn, logout }}
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
