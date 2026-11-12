import { pageMetadata } from "@/lib/seo/site";

/** Search title and description for the sign-in page (the page itself runs in the browser). */
export const metadata = pageMetadata({
  title: "Sign in to your dashboard",
  description: "Sign in to OneGrasp to see your career report, your Year Plan and every course, lab and tool on your dashboard.",
  path: "/signin",
});

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
