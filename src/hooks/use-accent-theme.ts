"use client";

import { useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { settingsRepo } from "@/lib/repositories";

const accents: Record<string, string> = {
  cyan: "188 94% 43%",
  violet: "262 83% 58%",
  emerald: "160 84% 39%",
  amber: "43 96% 56%"
};

export function useAccentTheme() {
  const accent = useLiveQuery(() => settingsRepo.get("accent"), [], undefined);
  const value = useMemo(() => accent?.value ?? "cyan", [accent]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", accents[value] ?? accents.cyan);
  }, [value]);

  const setAccent = async (next: string) => {
    await settingsRepo.set("accent", next);
  };

  return { value, setAccent, options: Object.keys(accents) };
}
