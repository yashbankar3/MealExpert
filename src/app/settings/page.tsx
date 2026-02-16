"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/app/page-shell";
import { useAccentTheme } from "@/hooks/use-accent-theme";
import { exportData, importData, plannerRepo, recipeRepo, settingsRepo, groceryRepo, pantryRepo, snapshotRepo } from "@/lib/repositories";
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
            await importData(parsed);
            toast.success("Import merged");
          }} />
          <Button variant="outline" onClick={() => ref.current?.click()}>Import JSON</Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-medium">Demo & Pantry suggestions</h3>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={async () => { await recipeRepo.save(demoRecipe); toast.success("Demo seeded"); }}>Seed demo data</Button>
          <Button variant="outline" onClick={async () => {
            const [recipes, planner, grocery, pantry, snapshots] = await Promise.all([recipeRepo.list(), plannerRepo.byWeek(undefined), groceryRepo.list(), pantryRepo.list(), snapshotRepo.list()]);
            await Promise.all([
              ...recipes.map((x) => recipeRepo.remove(x.id)),
              ...planner.map((x) => plannerRepo.remove(x.id)),
              ...grocery.map((x) => groceryRepo.remove(x.id)),
              ...pantry.map((x) => pantryRepo.remove(x.id)),
              ...snapshots.map((x) => fetch(`/api/snapshots?id=${x.id}`, { method: "DELETE", headers: { "x-client-id": localStorage.getItem("mealprep-client-id") ?? "" } }))
            ]);
            toast.success("Demo removed");
          }}>Remove demo data</Button>
          <Button variant="outline" onClick={async () => { const curr = await settingsRepo.get("suggestPantry"); await settingsRepo.set("suggestPantry", curr?.value === "true" ? "false" : "true"); toast.success("Pantry suggestion toggled"); }}>Toggle pantry suggestion</Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-medium text-destructive">Danger zone</h3>
        <Button variant="destructive" onClick={async () => {
          if (!confirm("Reset all app data?")) return;
          const data = await exportData();
          await Promise.all([
            ...data.recipes.map((x) => recipeRepo.remove(x.id)),
            ...data.planner.map((x) => plannerRepo.remove(x.id)),
            ...data.grocery.map((x) => groceryRepo.remove(x.id)),
            ...data.pantry.map((x) => pantryRepo.remove(x.id)),
            ...data.snapshots.map((x) => fetch(`/api/snapshots?id=${x.id}`, { method: "DELETE", headers: { "x-client-id": localStorage.getItem("mealprep-client-id") ?? "" } }))
          ]);
          await Promise.all((await settingsRepo.list()).map((s) => settingsRepo.set(s.key, "")));
          toast.success("All data reset");
        }}>Reset all data</Button>
      </Card>
    </PageShell>
  );
}
