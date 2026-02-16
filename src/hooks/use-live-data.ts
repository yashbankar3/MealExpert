"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { startOfWeekIso } from "@/lib/utils";

export function useRecipes() {
  return useLiveQuery(() => db.recipes.toArray(), [], []);
}

export function usePlanner(weekStart = startOfWeekIso()) {
  return useLiveQuery(() => db.planner.where("weekStart").equals(weekStart).toArray(), [weekStart], []);
}

export function useGrocery() {
  return useLiveQuery(() => db.grocery.toArray(), [], []);
}

export function usePantry() {
  return useLiveQuery(() => db.pantry.toArray(), [], []);
}

export function useSettings() {
  return useLiveQuery(() => db.settings.toArray(), [], []);
}

export function useSnapshots() {
  return useLiveQuery(() => db.snapshots.toArray(), [], []);
}
