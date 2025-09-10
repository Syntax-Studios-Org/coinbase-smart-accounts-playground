"use client";
import ClientApp from "@/components/layout/ClientApp";
import Providers from "@/components/Providers";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Home page for the Next.js app
 *
 * @returns The home page
 */
export default function Home() {
  return (
    <ErrorBoundary>
      <Providers>
        <ClientApp />
      </Providers>
    </ErrorBoundary>
  );
}
