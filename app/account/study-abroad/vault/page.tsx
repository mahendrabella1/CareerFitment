import { redirect } from "next/navigation";
import { AbroadDocumentVaultClient } from "@/components/studyAbroad/AbroadDocumentVaultClient";
import { UPLOADS_ENABLED } from "@/lib/features/uploads";

export default function StudyAbroadVaultPage() {
  // Hidden while file uploads are off (lib/features/uploads.ts): old links go to the section's home.
  if (!UPLOADS_ENABLED) redirect("/account/study-abroad");
  return <AbroadDocumentVaultClient />;
}
