"use client";

import { useEffect, useState } from "react";
import { settingsRepo } from "@/lib/repositories";

const accents: Record<string, string> = {
  cyan: "188 94% 43%",
  violet: "262 83% 58%",
  emerald: "160 84% 39%",
  amber: "43 96% 56%"
};

export function useAccentTheme() {
  const [value, setValue] = useState("cyan");

  useEffect(() => {
    void settingsRepo.get("accent").then((accent) => setValue(accent?.value ?? "cyan")).catch(() => setValue("cyan"));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", accents[value] ?? accents.cyan);
  }, [value]);

  const setAccent = async (next: string) => {
    await settingsRepo.set("accent", next);
    setValue(next);
  };

  return { value, setAccent, options: Object.keys(accents) };
}
