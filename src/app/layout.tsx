import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CDP Smart Account Playground",
  description: "Explore the power of CDP Smart Accounts with gasless transactions, batch operations, and enhanced UX",
};

/**
 * Root layout for the Next.js app
 *
 * @param props - { object } - The props for the RootLayout component
 * @param props.children - { React.ReactNode } - The children to wrap
 * @returns The wrapped children
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="root">{children}</div>
      </body>
    </html>
  );
}
