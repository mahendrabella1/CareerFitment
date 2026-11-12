/** The 404 page (code-quality audit Q-06). */
import Link from "next/link";
import { ErrorScreen, primaryButton, secondaryButton } from "@/components/errors/ErrorScreen";

export default function NotFound() {
  return (
    <ErrorScreen title="Page not found" text="That page doesn't exist or has moved. Check the address, or head back to your dashboard.">
      <Link href="/account" style={primaryButton}>My dashboard</Link>
      <Link href="/" style={secondaryButton}>Home</Link>
    </ErrorScreen>
  );
}
