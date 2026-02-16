"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageShell } from "@/components/app/page-shell";
import { usePlanner, useRecipes } from "@/hooks/use-live-data";
import { dayNames, scaleIngredients, slots, startOfWeekIso } from "@/lib/utils";
import { plannerRepo, recipeRepo } from "@/lib/repositories";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const recipes = useRecipes();
  usePlanner();
  const recipe = recipes.find((r) => r.id === id);
  const [servings, setServings] = useState(2);
  const [day, setDay] = useState("0");
  const [slot, setSlot] = useState<(typeof slots)[number]>("dinner");

  const scaled = useMemo(() => recipe ? scaleIngredients(recipe, servings) : [], [recipe, servings]);
  if (!recipe) return <PageShell title="Recipe"><Card>Recipe not found.</Card></PageShell>;

  return (
    <PageShell title={recipe.name}>
      <Card>
        <p className="text-sm text-muted-foreground">{recipe.description}</p>
        <div className="mt-3 flex items-end gap-2">
          <Input type="number" value={servings} min={1} onChange={(e) => setServings(Number(e.target.value) || recipe.servingsDefault)} aria-label="Scale servings" />
          <p className="text-xs">Default: {recipe.servingsDefault}</p>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {scaled.map((i, idx) => <li key={`${i.name}-${idx}`}>{i.name}: {i.quantity} {i.unit}</li>)}
        </ul>
      </Card>
      <Card>
        <h3 className="mb-2 font-medium">Quick add to planner</h3>
        <div className="grid gap-2 md:grid-cols-3">
          <Select value={day} onValueChange={setDay}><SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger><SelectContent>{dayNames.map((d, i) => <SelectItem key={d} value={String(i)}>{d}</SelectItem>)}</SelectContent></Select>
          <Select value={slot} onValueChange={(v) => setSlot(v as typeof slot)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{slots.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          <Button onClick={async () => { await plannerRepo.save({ weekStart: startOfWeekIso(), dayIndex: Number(day), slot, recipeId: recipe.id }); toast.success("Added to planner"); }}>Add</Button>
        </div>
      </Card>
      <div className="flex gap-2">
        <Button variant="destructive" onClick={async () => { await recipeRepo.remove(recipe.id); toast.success("Deleted"); router.push("/recipes"); }}>Delete recipe</Button>
      </div>
    </PageShell>
  );
}
