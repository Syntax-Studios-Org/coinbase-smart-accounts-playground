"use client";

import { LoadingSpinner } from "@coinbase/cdp-react/components/ui/LoadingSpinner";

/**
 * App loading screen
 */
export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <h1 className="sr-only">Loading</h1>
      <LoadingSpinner />
    </main>
  );
}
