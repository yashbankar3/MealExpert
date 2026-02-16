"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useAccentTheme } from "@/hooks/use-accent-theme";

export function Providers({ children }: { children: React.ReactNode }) {
  useAccentTheme();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
