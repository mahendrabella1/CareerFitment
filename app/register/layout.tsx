import { pageMetadata } from "@/lib/seo/site";

/** Search title and description for the sign-up page (the page itself runs in the browser). */
export const metadata = pageMetadata({
  title: "Sign up and take the career assessment",
  description: "Create your OneGrasp account - Class 6 to undergraduates, or as a working professional - then take the career fitment test and open your dashboard.",
  path: "/register",
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
