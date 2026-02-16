import { db } from "@/lib/db";
import type { GroceryItem, PantryItem, PlanEntry, Recipe, Setting, Snapshot } from "@/lib/types";
import { guessCategory, nowIso, startOfWeekIso } from "@/lib/utils";

export const recipeRepo = {
  list: () => db.recipes.toArray(),
  get: (id: string) => db.recipes.get(id),
  save: async (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const timestamp = nowIso();
    const item: Recipe = {
      ...recipe,
      id: recipe.id ?? crypto.randomUUID(),
      createdAt: recipe.id ? (await db.recipes.get(recipe.id))?.createdAt ?? timestamp : timestamp,
      updatedAt: timestamp
    };
    await db.recipes.put(item);
    return item;
  },
  remove: (id: string) => db.recipes.delete(id)
};

export const plannerRepo = {
  byWeek: (weekStart = startOfWeekIso()) => db.planner.where("weekStart").equals(weekStart).toArray(),
  save: async (entry: Omit<PlanEntry, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    const timestamp = nowIso();
    const item: PlanEntry = {
      ...entry,
      id: entry.id ?? crypto.randomUUID(),
      createdAt: entry.id ? (await db.planner.get(entry.id))?.createdAt ?? timestamp : timestamp,
      updatedAt: timestamp
    };
    await db.planner.put(item);
    return item;
  },
  remove: (id: string) => db.planner.delete(id),
  clearWeek: async (weekStart = startOfWeekIso()) => {
    const ids = (await db.planner.where("weekStart").equals(weekStart).primaryKeys()) as string[];
    await db.planner.bulkDelete(ids);
  }
};

export const groceryRepo = {
  list: () => db.grocery.toArray(),
  save: async (item: Omit<GroceryItem, "id" | "createdAt" | "updatedAt" | "category"> & { id?: string; category?: string }) => {
    const timestamp = nowIso();
    const value: GroceryItem = {
      ...item,
      id: item.id ?? crypto.randomUUID(),
      category: item.category ?? guessCategory(item.name),
      createdAt: item.id ? (await db.grocery.get(item.id))?.createdAt ?? timestamp : timestamp,
      updatedAt: timestamp
    };
    await db.grocery.put(value);
    return value;
  },
  remove: (id: string) => db.grocery.delete(id),
  clearChecked: async () => {
    const ids = (await db.grocery.where("checked").equals(1).primaryKeys()) as string[];
    await db.grocery.bulkDelete(ids);
  }
};

export const pantryRepo = {
  list: () => db.pantry.toArray(),
  save: async (item: Omit<PantryItem, "id" | "updatedAt"> & { id?: string }) => {
    const value: PantryItem = {
      ...item,
      id: item.id ?? crypto.randomUUID(),
      updatedAt: nowIso()
    };
    await db.pantry.put(value);
    return value;
  },
  remove: (id: string) => db.pantry.delete(id)
};

export const settingsRepo = {
  get: (key: string) => db.settings.get(key),
  set: async (key: string, value: string) => {
    const record: Setting = { key, value, updatedAt: nowIso() };
    await db.settings.put(record);
  },
  list: () => db.settings.toArray()
};

export const snapshotRepo = {
  list: () => db.snapshots.toArray(),
  add: (lowStockCount: number) => db.snapshots.put({ id: crypto.randomUUID(), date: nowIso(), lowStockCount }),
  clear: () => db.snapshots.clear(),
  bulkPut: (data: Snapshot[]) => db.snapshots.bulkPut(data)
};

export async function exportData() {
  const [recipes, planner, grocery, pantry, snapshots, settings] = await Promise.all([
    db.recipes.toArray(),
    db.planner.toArray(),
    db.grocery.toArray(),
    db.pantry.toArray(),
    db.snapshots.toArray(),
    db.settings.toArray()
  ]);
  return { recipes, planner, grocery, pantry, snapshots, settings };
}
