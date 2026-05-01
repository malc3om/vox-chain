"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[VoxChain] Unhandled error:", error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-[var(--spacing-page)]"
      role="alert"
      aria-live="assertive"
    >
      <div className="premium-card max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
          ⚠
        </div>
        <h2 className="font-heading text-2xl font-medium mb-3">Something went wrong</h2>
        <p className="text-text-muted text-sm mb-8 leading-relaxed">
          An unexpected error occurred. Your data is safe — please try again.
        </p>
        <button
          onClick={reset}
          className="bg-white text-black px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
