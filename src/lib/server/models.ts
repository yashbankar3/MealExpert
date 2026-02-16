import { Schema, model, models, type Model } from "mongoose";
import type { GroceryItem, PantryItem, PlanEntry, Recipe, Setting, Snapshot } from "@/lib/types";

interface BaseDoc {
  id: string;
  clientId: string;
  updatedAt: string;
}

type RecipeDoc = BaseDoc & Recipe;
type PlanDoc = BaseDoc & PlanEntry;
type GroceryDoc = BaseDoc & GroceryItem;
type PantryDoc = BaseDoc & PantryItem;
type SettingDoc = BaseDoc & Setting;
type SnapshotDoc = BaseDoc & Snapshot;

const baseFields = {
  id: { type: String, required: true },
  clientId: { type: String, required: true, index: true },
  updatedAt: { type: String, required: true }
};

const RecipeSchema = new Schema<RecipeDoc>({
  ...baseFields,
  name: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String, required: true }],
  servingsDefault: { type: Number, required: true },
  ingredients: [{ name: String, quantity: Number, unit: String }],
  steps: [{ type: String, required: true }],
  createdAt: { type: String, required: true }
});
RecipeSchema.index({ clientId: 1, id: 1 }, { unique: true });

const PlannerSchema = new Schema<PlanDoc>({
  ...baseFields,
  weekStart: { type: String, required: true },
  dayIndex: { type: Number, required: true },
  slot: { type: String, required: true },
  recipeId: { type: String },
  customMeal: { type: String },
  createdAt: { type: String, required: true }
});
PlannerSchema.index({ clientId: 1, id: 1 }, { unique: true });

const GrocerySchema = new Schema<GroceryDoc>({
  ...baseFields,
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  checked: { type: Boolean, required: true },
  source: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: String, required: true }
});
GrocerySchema.index({ clientId: 1, id: 1 }, { unique: true });

const PantrySchema = new Schema<PantryDoc>({
  ...baseFields,
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  lowStockThreshold: { type: Number, required: true }
});
PantrySchema.index({ clientId: 1, id: 1 }, { unique: true });

const SettingsSchema = new Schema<SettingDoc>({
  ...baseFields,
  key: { type: String, required: true },
  value: { type: String, required: true }
});
SettingsSchema.index({ clientId: 1, key: 1 }, { unique: true });

const SnapshotSchema = new Schema<SnapshotDoc>({
  ...baseFields,
  date: { type: String, required: true },
  lowStockCount: { type: Number, required: true }
});
SnapshotSchema.index({ clientId: 1, id: 1 }, { unique: true });

export const RecipeModel = (models.Recipe as Model<RecipeDoc>) || model<RecipeDoc>("Recipe", RecipeSchema);
export const PlannerModel = (models.Planner as Model<PlanDoc>) || model<PlanDoc>("Planner", PlannerSchema);
export const GroceryModel = (models.Grocery as Model<GroceryDoc>) || model<GroceryDoc>("Grocery", GrocerySchema);
export const PantryModel = (models.Pantry as Model<PantryDoc>) || model<PantryDoc>("Pantry", PantrySchema);
export const SettingsModel = (models.Settings as Model<SettingDoc>) || model<SettingDoc>("Settings", SettingsSchema);
export const SnapshotModel = (models.Snapshot as Model<SnapshotDoc>) || model<SnapshotDoc>("Snapshot", SnapshotSchema);
