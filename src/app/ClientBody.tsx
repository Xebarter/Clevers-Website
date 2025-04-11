"use client";

import type React from "react";
import { ThemeProvider } from "next-themes";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
