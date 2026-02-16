"use client";

import { useCallback, useEffect, useState } from "react";
import type { GroceryItem, PantryItem, PlanEntry, Recipe, Setting, Snapshot } from "@/lib/types";
import { groceryRepo, pantryRepo, plannerRepo, recipeRepo, settingsRepo, snapshotRepo } from "@/lib/repositories";

type LiveArray<T> = T[] & { reload: () => Promise<void> };

function withReload<T>(data: T[], reload: () => Promise<void>): LiveArray<T> {
  return Object.assign([...data], { reload }) as LiveArray<T>;
}

function useRemoteData<T>(fetcher: () => Promise<T[]>, deps: ReadonlyArray<unknown>) {
  const [data, setData] = useState<T[]>([]);

  const reload = useCallback(async () => {
    const result = await fetcher();
    setData(result);
  }, deps);

  useEffect(() => {
    void reload();
  }, [reload]);

  return withReload(data, reload);
}

export function useRecipes() {
  return useRemoteData<Recipe>(() => recipeRepo.list(), []);
}

export function usePlanner(weekStart?: string) {
  return useRemoteData<PlanEntry>(() => plannerRepo.byWeek(weekStart), [weekStart]);
}

export function useGrocery() {
  return useRemoteData<GroceryItem>(() => groceryRepo.list(), []);
}

export function usePantry() {
  return useRemoteData<PantryItem>(() => pantryRepo.list(), []);
}

export function useSettings() {
  return useRemoteData<Setting>(() => settingsRepo.list(), []);
}

export function useSnapshots() {
  return useRemoteData<Snapshot>(() => snapshotRepo.list(), []);
}
