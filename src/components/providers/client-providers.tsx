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
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="wmsc-theme"
      themes={["light", "dark"]}
      forcedTheme={undefined} // Set to "dark" for SSR consistency if needed
      enableColorScheme={true}
      // enableColorScheme controls whether color-scheme is applied to the document
      // when using "class" strategy, color-scheme is applied through CSS instead of inline styles
    >
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}

