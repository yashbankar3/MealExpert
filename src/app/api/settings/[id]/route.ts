import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { SettingsModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const patchSchema = z.object({ value: z.string() });

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    const { id } = await params;
    const item = await SettingsModel.findOne({ clientId, key: id }).lean();
    if (!item) return NextResponse.json({ key: id, value: "", id, clientId, updatedAt: new Date(0).toISOString() });
    return NextResponse.json(item);
  } catch {
    return serverError();
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const { value } = patchSchema.parse(await request.json());
    await connectToDatabase();
    const { id } = await params;
    const now = new Date().toISOString();
    const item = await SettingsModel.findOneAndUpdate(
      { clientId, key: id },
      { id, key: id, value, clientId, updatedAt: now },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) return badRequest(error.message);
    return serverError();
  }
}
