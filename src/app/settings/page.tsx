"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/app/page-shell";
import { useAccentTheme } from "@/hooks/use-accent-theme";
import { db } from "@/lib/db";
import { exportData, recipeRepo, settingsRepo } from "@/lib/repositories";
import { importSchema } from "@/lib/validators";

const demoRecipe = {
  name: "Overnight Oats",
  description: "Easy breakfast",
  tags: ["breakfast", "quick"],
  servingsDefault: 1,
  ingredients: [{ name: "Oats", quantity: 0.5, unit: "cup" }, { name: "Milk", quantity: 1, unit: "cup" }],
  steps: ["Mix ingredients", "Refrigerate overnight"]
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { value, setAccent, options } = useAccentTheme();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <PageShell title="Settings">
      <Card className="space-y-3">
        <h3 className="font-medium">Appearance</h3>
        <div className="flex gap-2"><Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>Light</Button><Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>Dark</Button></div>
        <div className="flex flex-wrap gap-2">{options.map((o) => <Button key={o} variant={value === o ? "default" : "outline"} onClick={() => setAccent(o)}>{o}</Button>)}</div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-medium">Data tools</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={async () => {
            const data = await exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "mealprep-export.json"; a.click();
            URL.revokeObjectURL(url);
          }}>Export JSON</Button>
          <input ref={ref} type="file" accept="application/json" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const parsed = importSchema.parse(JSON.parse(await file.text()));
            for (const key of ["recipes", "planner", "grocery", "pantry", "snapshots", "settings"] as const) {
              const table = db.table(key);
              for (const item of parsed[key]) {
                const existing = await table.get((item as { id?: string; key?: string }).id ?? (item as { key?: string }).key ?? "");
                if (!existing || String((item as { updatedAt?: string }).updatedAt ?? "") > String((existing as { updatedAt?: string }).updatedAt ?? "")) {
                  await table.put(item);
                }
              }
            }
            toast.success("Import merged");
          }} />
          <Button variant="outline" onClick={() => ref.current?.click()}>Import JSON</Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-medium">Demo & Pantry suggestions</h3>
        <div className="flex gap-2">
          <Button onClick={async () => { await recipeRepo.save(demoRecipe); toast.success("Demo seeded"); }}>Seed demo data</Button>
          <Button variant="outline" onClick={async () => { await db.recipes.clear(); await db.planner.clear(); await db.grocery.clear(); await db.pantry.clear(); await db.snapshots.clear(); toast.success("Demo removed"); }}>Remove demo data</Button>
          <Button variant="outline" onClick={async () => { const curr = await settingsRepo.get("suggestPantry"); await settingsRepo.set("suggestPantry", curr?.value === "true" ? "false" : "true"); toast.success("Pantry suggestion toggled"); }}>Toggle pantry suggestion</Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-medium text-destructive">Danger zone</h3>
        <Button variant="destructive" onClick={async () => { if (confirm("Reset all app data?")) { await Promise.all([db.recipes.clear(), db.planner.clear(), db.grocery.clear(), db.pantry.clear(), db.snapshots.clear(), db.settings.clear()]); toast.success("All data reset"); } }}>Reset all data</Button>
      </Card>
    </PageShell>
  );
}
