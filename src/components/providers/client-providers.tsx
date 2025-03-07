'use client';

import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}

