import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1)
});

const entityBase = {
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  updatedAt: z.string()
};

export const recipeSchema = z.object({
  ...entityBase,
  name: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
  servingsDefault: z.number().positive(),
  ingredients: z.array(ingredientSchema),
  steps: z.array(z.string()),
  createdAt: z.string()
});

export const planEntrySchema = z.object({
  ...entityBase,
  weekStart: z.string(),
  dayIndex: z.number().int().min(0).max(6),
  slot: z.enum(["breakfast", "lunch", "dinner"]),
  recipeId: z.string().uuid().optional(),
  customMeal: z.string().optional(),
  createdAt: z.string()
});

export const grocerySchema = z.object({
  ...entityBase,
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  checked: z.boolean(),
  source: z.enum(["manual", "plan"]),
  category: z.string(),
  createdAt: z.string()
});

export const pantrySchema = z.object({
  ...entityBase,
  name: z.string().min(1),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1),
  lowStockThreshold: z.number().nonnegative()
});

export const snapshotSchema = z.object({
  ...entityBase,
  date: z.string(),
  lowStockCount: z.number().int().nonnegative()
});

export const settingSchema = z.object({
  ...entityBase,
  key: z.string(),
  value: z.string()
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
