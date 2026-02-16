"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/app/page-shell";
import { usePantry, usePlanner, useRecipes, useSettings } from "@/hooks/use-live-data";
import { dayNames, slots, startOfWeekIso } from "@/lib/utils";
import { groceryRepo, plannerRepo } from "@/lib/repositories";

export default function PlannerPage() {
  const weekStart = startOfWeekIso();
  const planner = usePlanner(weekStart);
  const recipes = useRecipes();
  const pantry = usePantry();
  const settings = useSettings();
  const [customByCell, setCustomByCell] = useState<Record<string, string>>({});

  const suggestPantry = settings.find((s) => s.key === "suggestPantry")?.value === "true";

  const cell = (dayIndex: number, slot: (typeof slots)[number]) => planner.find((p) => p.dayIndex === dayIndex && p.slot === slot);

  const generate = async () => {
    const map = new Map<string, { name: string; unit: string; quantity: number }>();
    planner.forEach((p) => {
      if (!p.recipeId) return;
      const recipe = recipes.find((r) => r.id === p.recipeId);
      recipe?.ingredients.forEach((i) => {
        const key = `${i.name.toLowerCase()}|${i.unit}`;
        const prev = map.get(key);
        map.set(key, { name: i.name, unit: i.unit, quantity: (prev?.quantity ?? 0) + i.quantity });
      });
    });

    for (const item of map.values()) {
      let qty = item.quantity;
      if (suggestPantry) {
        const p = pantry.find((x) => x.name.toLowerCase() === item.name.toLowerCase() && x.unit === item.unit);
        qty = Math.max(0, qty - (p?.quantity ?? 0));
      }
      if (qty <= 0) continue;
      await groceryRepo.save({ name: item.name, quantity: Number(qty.toFixed(2)), unit: item.unit, checked: false, source: "plan" });
    }
    toast.success("Grocery items generated");
  };

  const duplicateLastWeek = async () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    const prevStart = prev.toISOString();
    const entries = await plannerRepo.byWeek(prevStart);
    await plannerRepo.clearWeek(weekStart);
    await Promise.all(entries.map((e) => plannerRepo.save({ weekStart, dayIndex: e.dayIndex, slot: e.slot, recipeId: e.recipeId, customMeal: e.customMeal })));
    await planner.reload();
    toast.success("Copied last week");
  };

  const plannedCount = useMemo(() => planner.length, [planner]);

  return (
    <PageShell title="Weekly Planner" action={<div className="flex gap-2"><Button onClick={duplicateLastWeek} variant="outline">Duplicate last week</Button><Button onClick={generate}>Generate Grocery</Button></div>}>
      <Card>Meals planned: {plannedCount}</Card>
      <div className="space-y-3">
        {slots.map((slot) => (
          <Card key={slot}>
            <h3 className="mb-2 capitalize">{slot}</h3>
            <div className="grid gap-2 md:grid-cols-7">
              {dayNames.map((day, idx) => {
                const entry = cell(idx, slot);
                const recipe = recipes.find((r) => r.id === entry?.recipeId);
                const k = `${idx}-${slot}`;
                return (
                  <div key={day} className="rounded-xl border border-white/20 bg-white/5 p-2 text-sm backdrop-blur">
                    <p className="font-semibold">{day}</p>
                    <p className="min-h-10 text-xs">{recipe?.name ?? entry?.customMeal ?? "Empty"}</p>
                    <div className="mt-2 flex gap-1">
                      <select aria-label={`Add ${day} ${slot}`} className="rounded border bg-transparent text-xs" onChange={async (e) => {
                        if (!e.target.value) return;
                        await plannerRepo.save({ weekStart, dayIndex: idx, slot, recipeId: e.target.value });
                        await planner.reload();
                      }}>
                        <option value="">Recipe...</option>
                        {recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <Button size="sm" variant="ghost" onClick={async () => { if (entry) { await plannerRepo.remove(entry.id); await planner.reload(); } }}>x</Button>
                    </div>
                    <Input className="mt-1 h-7 text-xs" placeholder="Custom meal" value={customByCell[k] ?? ""} onChange={(e) => setCustomByCell((prevState) => ({ ...prevState, [k]: e.target.value }))} onBlur={async () => {
                      const customValue = (customByCell[k] ?? "").trim();
                      if (!customValue) return;
                      await plannerRepo.save({ weekStart, dayIndex: idx, slot, customMeal: customValue });
                      await planner.reload();
                      setCustomByCell((prevState) => ({ ...prevState, [k]: "" }));
                    }} />
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
