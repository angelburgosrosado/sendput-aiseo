import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/context/app-context";

export const metadata: Metadata = {
  title: "SignalForge | Enterprise Search & AI Discovery Intelligence",
  description:
    "Search intelligence for teams building durable visibility across web and AI discovery. Organic domain research, AI citation tracking, technical audits, and licensed provider integrations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-forge-950 text-forge-100 antialiased selection:bg-seafoam-500/30 selection:text-seafoam-200">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
