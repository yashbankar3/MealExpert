"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { readLegacyData } from "@/lib/legacy-db";
import { importData } from "@/lib/repositories";

const MIGRATED_KEY = "mealprep-legacy-migrated";

export function useLegacyMigration() {
  useEffect(() => {
    const run = async () => {
      if (window.localStorage.getItem(MIGRATED_KEY) === "true") return;
      try {
        const payload = await readLegacyData();
        const count = Object.values(payload).reduce((acc, current) => acc + current.length, 0);
        if (count > 0) {
          await importData(payload);
          toast.success("Legacy offline data migrated to cloud database");
        }
        window.localStorage.setItem(MIGRATED_KEY, "true");
      } catch {
        window.localStorage.setItem(MIGRATED_KEY, "true");
      }
    };
    void run();
  }, []);
}
