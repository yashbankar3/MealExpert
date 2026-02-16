import Dexie, { type Table } from "dexie";
import type { GroceryItem, PantryItem, PlanEntry, Recipe, Setting, Snapshot } from "@/lib/types";

class LegacyDB extends Dexie {
  recipes!: Table<Recipe, string>;
  planner!: Table<PlanEntry, string>;
  grocery!: Table<GroceryItem, string>;
  pantry!: Table<PantryItem, string>;
  snapshots!: Table<Snapshot, string>;
  settings!: Table<Setting, string>;

  constructor() {
    super("mealprep-mini");
    this.version(2).stores({
      recipes: "id, name, updatedAt",
      planner: "id, weekStart, dayIndex, slot, updatedAt",
      grocery: "id, checked, source, name, category, updatedAt",
      pantry: "id, name, updatedAt",
      snapshots: "id, date",
      settings: "key, updatedAt"
    });
  }
}

export async function readLegacyData() {
  const db = new LegacyDB();
  await db.open();
  const [recipes, planner, grocery, pantry, snapshots, settings] = await Promise.all([
    db.recipes.toArray(),
    db.planner.toArray(),
    db.grocery.toArray(),
    db.pantry.toArray(),
    db.snapshots.toArray(),
    db.settings.toArray()
  ]);
  await db.close();
  return { recipes, planner, grocery, pantry, snapshots, settings };
}
