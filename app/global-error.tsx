"use client";
/** Shown when even the root layout fails, so it brings its own <html> and <body> (code-quality audit Q-06). */
import { useEffect } from "react";
import { ErrorScreen, primaryButton, secondaryButton } from "@/components/errors/ErrorScreen";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ErrorScreen title="Something went wrong" text="OneGrasp couldn't load this page. Please try again in a moment." reference={error.digest}>
          <button type="button" style={primaryButton} onClick={() => reset()}>Try again</button>
          <a href="/" style={secondaryButton}>Home</a>
        </ErrorScreen>
      </body>
    </html>
  );
}
