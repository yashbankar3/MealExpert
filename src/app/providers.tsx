"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useAccentTheme } from "@/hooks/use-accent-theme";
import { useLegacyMigration } from "@/hooks/use-legacy-migration";

export function Providers({ children }: { children: React.ReactNode }) {
  useAccentTheme();
  useLegacyMigration();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
