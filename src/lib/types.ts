export type MealSlot = "breakfast" | "lunch" | "dinner";

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  tags: string[];
  servingsDefault: number;
  ingredients: Ingredient[];
  steps: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanEntry {
  id: string;
  weekStart: string;
  dayIndex: number;
  slot: MealSlot;
  recipeId?: string;
  customMeal?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  source: "manual" | "plan";
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface Snapshot {
  id: string;
  date: string;
  lowStockCount: number;
}

export interface Setting {
  key: string;
  value: string;
  updatedAt: string;
}
