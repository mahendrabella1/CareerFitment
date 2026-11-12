import { redirect } from "next/navigation";
import { DocumentVaultClient } from "@/components/scholarships/DocumentVaultClient";
import { UPLOADS_ENABLED } from "@/lib/features/uploads";

export default function ScholarshipVaultPage() {
  // Hidden while file uploads are off (lib/features/uploads.ts): old links go to the section's home.
  if (!UPLOADS_ENABLED) redirect("/account/scholarships");
  return <DocumentVaultClient />;
}
