import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1)
});

export const recipeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
  servingsDefault: z.number().positive(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const planEntrySchema = z.object({
  id: z.string().uuid(),
  weekStart: z.string(),
  dayIndex: z.number().int().min(0).max(6),
  slot: z.enum(["breakfast", "lunch", "dinner"]),
  recipeId: z.string().uuid().optional(),
  customMeal: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const grocerySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  checked: z.boolean(),
  source: z.enum(["manual", "plan"]),
  category: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const pantrySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  lowStockThreshold: z.number().nonnegative(),
  updatedAt: z.string()
});

export const snapshotSchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  lowStockCount: z.number().int().nonnegative()
});

export const settingSchema = z.object({
  key: z.string(),
  value: z.string(),
  updatedAt: z.string()
});

export const importSchema = z.object({
  recipes: z.array(recipeSchema).default([]),
  planner: z.array(planEntrySchema).default([]),
  grocery: z.array(grocerySchema).default([]),
  pantry: z.array(pantrySchema).default([]),
  snapshots: z.array(snapshotSchema).default([]),
  settings: z.array(settingSchema).default([])
});

export type ImportPayload = z.infer<typeof importSchema>;
