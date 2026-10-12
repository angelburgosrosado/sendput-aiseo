import React from "react";
import { AppShell } from "@/components/shell/app-layout";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
