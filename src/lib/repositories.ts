import type { GroceryItem, PantryItem, PlanEntry, Recipe, Setting, Snapshot } from "@/lib/types";
import { apiFetch } from "@/lib/http";
import { guessCategory, nowIso, startOfWeekIso } from "@/lib/utils";

export const recipeRepo = {
  list: async () => apiFetch<Recipe[]>("/api/recipes"),
  get: async (id: string) => apiFetch<Recipe>(`/api/recipes/${id}`),
  save: async (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "clientId"> & { id?: string }) => {
    if (recipe.id) {
      return apiFetch<Recipe>(`/api/recipes/${recipe.id}`, { method: "PATCH", body: JSON.stringify({ ...recipe, updatedAt: nowIso() }) });
    }
    return apiFetch<Recipe>("/api/recipes", { method: "POST", body: JSON.stringify(recipe) });
  },
  remove: async (id: string) => {
    await apiFetch<{ ok: boolean }>(`/api/recipes/${id}`, { method: "DELETE" });
  }
};

export const plannerRepo = {
  byWeek: async (weekStart = startOfWeekIso()) => apiFetch<PlanEntry[]>(`/api/planner?weekStart=${encodeURIComponent(weekStart)}`),
  save: async (entry: Omit<PlanEntry, "id" | "createdAt" | "updatedAt" | "clientId"> & { id?: string }) => {
    if (entry.id) {
      return apiFetch<PlanEntry>(`/api/planner/${entry.id}`, { method: "PATCH", body: JSON.stringify({ ...entry, updatedAt: nowIso() }) });
    }
    return apiFetch<PlanEntry>("/api/planner", { method: "POST", body: JSON.stringify(entry) });
  },
  remove: async (id: string) => {
    await apiFetch<{ ok: boolean }>(`/api/planner/${id}`, { method: "DELETE" });
  },
  clearWeek: async (weekStart = startOfWeekIso()) => {
    const items = await plannerRepo.byWeek(weekStart);
    await Promise.all(items.map((item) => plannerRepo.remove(item.id)));
  }
};

export const groceryRepo = {
  list: async () => apiFetch<GroceryItem[]>("/api/grocery"),
  save: async (item: Omit<GroceryItem, "id" | "createdAt" | "updatedAt" | "clientId" | "category"> & { id?: string; category?: string }) => {
    const payload = { ...item, category: item.category ?? guessCategory(item.name) };
    if (item.id) {
      return apiFetch<GroceryItem>(`/api/grocery/${item.id}`, { method: "PATCH", body: JSON.stringify({ ...payload, updatedAt: nowIso() }) });
    }
    return apiFetch<GroceryItem>("/api/grocery", { method: "POST", body: JSON.stringify(payload) });
  },
  remove: async (id: string) => {
    await apiFetch<{ ok: boolean }>(`/api/grocery/${id}`, { method: "DELETE" });
  },
  clearChecked: async () => {
    const items = await groceryRepo.list();
    await Promise.all(items.filter((item) => item.checked).map((item) => groceryRepo.remove(item.id)));
  }
};

export const pantryRepo = {
  list: async () => apiFetch<PantryItem[]>("/api/pantry"),
  save: async (item: Omit<PantryItem, "id" | "updatedAt" | "clientId"> & { id?: string }) => {
    if (item.id) {
      return apiFetch<PantryItem>(`/api/pantry/${item.id}`, { method: "PATCH", body: JSON.stringify({ ...item, updatedAt: nowIso() }) });
    }
    return apiFetch<PantryItem>("/api/pantry", { method: "POST", body: JSON.stringify(item) });
  },
  remove: async (id: string) => {
    await apiFetch<{ ok: boolean }>(`/api/pantry/${id}`, { method: "DELETE" });
  }
};

export const settingsRepo = {
  get: async (key: string) => apiFetch<Setting>(`/api/settings/${key}`),
  set: async (key: string, value: string) => apiFetch<Setting>(`/api/settings/${key}`, { method: "PATCH", body: JSON.stringify({ value }) }),
  list: async () => apiFetch<Setting[]>("/api/settings")
};

export const snapshotRepo = {
  list: async () => apiFetch<Snapshot[]>("/api/snapshots"),
  add: async (lowStockCount: number) => apiFetch<Snapshot>("/api/snapshots", { method: "POST", body: JSON.stringify({ lowStockCount }) }),
  clear: async () => {
    const snapshots = await snapshotRepo.list();
    await Promise.all(snapshots.map((s) => apiFetch(`/api/snapshots?id=${s.id}`, { method: "DELETE" })));
  }
};

export async function exportData() {
  const [recipes, planner, grocery, pantry, snapshots, settings] = await Promise.all([
    recipeRepo.list(),
    apiFetch<PlanEntry[]>("/api/planner"),
    groceryRepo.list(),
    pantryRepo.list(),
    snapshotRepo.list(),
    settingsRepo.list()
  ]);
  return { recipes, planner, grocery, pantry, snapshots, settings };
}

export async function importData(payload: {
  recipes: Recipe[];
  planner: PlanEntry[];
  grocery: GroceryItem[];
  pantry: PantryItem[];
  snapshots: Snapshot[];
  settings: Setting[];
}) {
  await apiFetch<{ ok: boolean }>("/api/migrate", { method: "POST", body: JSON.stringify(payload) });
}
