import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "@/app/providers";
import { AppNav } from "@/components/app/nav";

export const metadata: Metadata = {
  title: "MealPrep Mini",
  description: "Offline-first meal planner and grocery manager",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppNav />
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
