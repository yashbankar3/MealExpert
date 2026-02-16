import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Ingredient, Recipe } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slots = ["breakfast", "lunch", "dinner"] as const;

export const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function nowIso() {
  return new Date().toISOString();
}

export function startOfWeekIso(date = new Date()): string {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function scaleIngredients(recipe: Recipe, servings: number): Ingredient[] {
  const ratio = servings / recipe.servingsDefault;
  return recipe.ingredients.map((ing) => ({ ...ing, quantity: Number((ing.quantity * ratio).toFixed(2)) }));
}

export function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (/(milk|cheese|yogurt|butter)/.test(n)) return "dairy";
  if (/(chicken|beef|fish|pork|egg)/.test(n)) return "protein";
  if (/(apple|banana|lettuce|tomato|onion)/.test(n)) return "produce";
  if (/(rice|pasta|bread|flour)/.test(n)) return "grains";
  return "other";
}
