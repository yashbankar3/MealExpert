import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/server/mongodb";
import { GroceryModel, PantryModel, PlannerModel, RecipeModel, SettingsModel, SnapshotModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";
import { importSchema } from "@/lib/validators";

async function upsertMany<T extends { id: string; updatedAt: string }>(clientId: string, model: { findOne: Function; findOneAndUpdate: Function; create: Function }, items: T[]) {
  for (const item of items) {
    const existing = (await model.findOne({ clientId, id: item.id }).lean?.()) as { updatedAt?: string } | null;
    if (!existing || item.updatedAt > String(existing.updatedAt ?? "")) {
      await model.findOneAndUpdate({ clientId, id: item.id }, { ...item, clientId }, { upsert: true, new: true });
    }
  }
}

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    const payload = importSchema.parse(await request.json());

    await upsertMany(clientId, RecipeModel, payload.recipes);
    await upsertMany(clientId, PlannerModel, payload.planner);
    await upsertMany(clientId, GroceryModel, payload.grocery);
    await upsertMany(clientId, PantryModel, payload.pantry);
    await upsertMany(clientId, SnapshotModel, payload.snapshots);

    for (const item of payload.settings) {
      const existing = await SettingsModel.findOne({ clientId, key: item.key }).lean();
      if (!existing || item.updatedAt > String(existing.updatedAt ?? "")) {
        await SettingsModel.findOneAndUpdate({ clientId, key: item.key }, { ...item, clientId, id: item.key }, { upsert: true, new: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return serverError("Migration failed");
  }
}
