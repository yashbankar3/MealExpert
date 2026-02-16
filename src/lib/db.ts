import Dexie, { type Table } from "dexie";
import type { GroceryItem, PantryItem, PlanEntry, Recipe, Setting, Snapshot } from "@/lib/types";

export class MealPrepDB extends Dexie {
  recipes!: Table<Recipe, string>;
  planner!: Table<PlanEntry, string>;
  grocery!: Table<GroceryItem, string>;
  pantry!: Table<PantryItem, string>;
  snapshots!: Table<Snapshot, string>;
  settings!: Table<Setting, string>;

  constructor() {
    super("mealprep-mini");
    this.version(1).stores({
      recipes: "id, name, updatedAt",
      planner: "id, weekStart, dayIndex, slot, updatedAt",
      grocery: "id, checked, source, name, updatedAt",
      pantry: "id, name, updatedAt",
      snapshots: "id, date",
      settings: "key, updatedAt"
    });

    this.version(2)
      .stores({
        recipes: "id, name, updatedAt",
        planner: "id, weekStart, dayIndex, slot, updatedAt",
        grocery: "id, checked, source, name, category, updatedAt",
        pantry: "id, name, updatedAt",
        snapshots: "id, date",
        settings: "key, updatedAt"
      })
      .upgrade(async (tx) => {
        await tx.table("grocery").toCollection().modify((item: GroceryItem) => {
          if (!item.category) item.category = "other";
        });
      });
  }
}

export const db = new MealPrepDB();
