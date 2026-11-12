"use client";
/** Any page that crashes while rendering shows this instead of a blank screen (code-quality audit Q-06). */
import { useEffect } from "react";
import { ErrorScreen, primaryButton, secondaryButton } from "@/components/errors/ErrorScreen";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <ErrorScreen title="Something went wrong" text="This page hit a problem. Try again, or go back to your dashboard." reference={error.digest}>
      <button type="button" style={primaryButton} onClick={() => reset()}>Try again</button>
      <a href="/account" style={secondaryButton}>My dashboard</a>
    </ErrorScreen>
  );
}
