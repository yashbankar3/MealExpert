"use client";

import { useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/app/page-shell";
import { useGrocery, usePantry, usePlanner, useRecipes, useSnapshots } from "@/hooks/use-live-data";
import { dayNames, startOfWeekIso } from "@/lib/utils";
import { snapshotRepo } from "@/lib/repositories";

export default function DashboardPage() {
  const planner = usePlanner(startOfWeekIso());
  const recipes = useRecipes();
  const grocery = useGrocery();
  const pantry = usePantry();
  const snapshots = useSnapshots();

  const low = pantry.filter((p) => p.quantity <= p.lowStockThreshold).length;

  useEffect(() => {
    void snapshotRepo.add(low);
  }, [low]);

  const perDay = useMemo(() => dayNames.map((d, i) => ({ day: d, meals: planner.filter((p) => p.dayIndex === i).length })), [planner]);
  const groceryPie = useMemo(() => [{ name: "Checked", value: grocery.filter((g) => g.checked).length }, { name: "Remaining", value: grocery.filter((g) => !g.checked).length }], [grocery]);
  const topIngredients = useMemo(() => {
    const counts = new Map<string, number>();
    planner.forEach((p) => {
      const r = recipes.find((x) => x.id === p.recipeId);
      r?.ingredients.forEach((i) => counts.set(i.name, (counts.get(i.name) ?? 0) + 1));
    });
    return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [planner, recipes]);

  return (
    <PageShell title="Dashboard">
      <div className="grid gap-3 md:grid-cols-3">
        <Card>Planned meals: <strong>{planner.length}</strong></Card>
        <Card>Unchecked grocery: <strong>{grocery.filter((g) => !g.checked).length}</strong></Card>
        <Card>Low stock: <strong>{low}</strong></Card>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="h-72"><h3 className="mb-2">Meals per day</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={perDay}><XAxis dataKey="day" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="meals" /></BarChart></ResponsiveContainer></Card>
        <Card className="h-72"><h3 className="mb-2">Grocery completion</h3><ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={groceryPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} /><Tooltip /></PieChart></ResponsiveContainer></Card>
      </div>
      <Card><h3 className="mb-2">Top ingredients</h3>{topIngredients.length ? <ul>{topIngredients.map((i) => <li key={i.name}>{i.name} ({i.count})</li>)}</ul> : <p className="text-sm">No planned recipes yet.</p>}</Card>
      <Card><h3 className="mb-2">Low stock trend snapshots</h3>{snapshots.slice(-7).map((s) => <p key={s.id} className="text-xs">{new Date(s.date).toLocaleDateString()}: {s.lowStockCount}</p>)}</Card>
    </PageShell>
  );
}
