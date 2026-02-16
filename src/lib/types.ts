export type MealSlot = "breakfast" | "lunch" | "dinner";

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface EntityBase {
  id: string;
  clientId: string;
  updatedAt: string;
}

export interface Recipe extends EntityBase {
  name: string;
  description: string;
  tags: string[];
  servingsDefault: number;
  ingredients: Ingredient[];
  steps: string[];
  createdAt: string;
}

export interface PlanEntry extends EntityBase {
  weekStart: string;
  dayIndex: number;
  slot: MealSlot;
  recipeId?: string;
  customMeal?: string;
  createdAt: string;
}

export interface GroceryItem extends EntityBase {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  source: "manual" | "plan";
  category: string;
  createdAt: string;
}

export interface PantryItem extends EntityBase {
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export interface Snapshot extends EntityBase {
  date: string;
  lowStockCount: number;
}

export interface Setting extends EntityBase {
  key: string;
  value: string;
}
