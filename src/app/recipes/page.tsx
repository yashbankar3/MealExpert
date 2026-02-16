"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/app/recipe-form";
import { PageShell } from "@/components/app/page-shell";
import { useRecipes } from "@/hooks/use-live-data";
import { recipeRepo } from "@/lib/repositories";

export default function RecipesPage() {
  const recipes = useRecipes();
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<"az" | "recent">("recent");

  const filtered = useMemo(() => {
    return [...recipes]
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
      .filter((r) => !tag || r.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())))
      .sort((a, b) => sort === "az" ? a.name.localeCompare(b.name) : b.updatedAt.localeCompare(a.updatedAt));
  }, [recipes, search, tag, sort]);

  return (
    <PageShell title="Recipes">
      <Card>
        <RecipeForm
          onSubmit={async (value) => {
            const ingredients = value.ingredients.split("\n").filter(Boolean).map((line) => {
              const [name, qty, unit] = line.split("|");
              return { name: name?.trim() ?? "", quantity: Number(qty ?? 0), unit: unit?.trim() ?? "unit" };
            });
            await recipeRepo.save({
              name: value.name,
              description: value.description,
              tags: value.tags.split(",").map((t) => t.trim()).filter(Boolean),
              servingsDefault: value.servingsDefault,
              ingredients,
              steps: value.steps.split("\n").filter(Boolean)
            });
            toast.success("Recipe saved");
          }}
        />
      </Card>

      <div className="grid gap-2 md:grid-cols-4">
        <Input aria-label="Search recipes" placeholder="Search recipes" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Input aria-label="Filter tag" placeholder="Tag filter" value={tag} onChange={(e) => setTag(e.target.value)} />
        <Button variant={sort === "az" ? "default" : "outline"} onClick={() => setSort("az")}>Sort A-Z</Button>
        <Button variant={sort === "recent" ? "default" : "outline"} onClick={() => setSort("recent")}>Sort Recent</Button>
      </div>

      {filtered.length === 0 ? <Card className="text-sm text-muted-foreground">No recipes yet.</Card> : (
        <div className="grid gap-3">
          {filtered.map((recipe) => (
            <Card key={recipe.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{recipe.name}</p>
                <p className="text-xs text-muted-foreground">{recipe.tags.join(", ") || "No tags"}</p>
              </div>
              <div className="space-x-2">
                <Link href={`/recipes/${recipe.id}`} className="text-sm underline">Open</Link>
                <Button size="sm" variant="destructive" onClick={async () => { await recipeRepo.remove(recipe.id); toast.success("Recipe deleted"); }}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
