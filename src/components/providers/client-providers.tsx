'use client';

import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}

