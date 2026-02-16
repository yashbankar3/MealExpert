import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { PlannerModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const patchSchema = z.object({ weekStart: z.string(), dayIndex: z.number(), slot: z.enum(["breakfast", "lunch", "dinner"]), recipeId: z.string().optional(), customMeal: z.string().optional(), updatedAt: z.string() });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const body = patchSchema.parse(await request.json());
    await connectToDatabase();
    const { id } = await params;
    const item = await PlannerModel.findOneAndUpdate({ clientId, id }, body, { new: true }).lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) return badRequest(error.message);
    return serverError();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    const { id } = await params;
    await PlannerModel.findOneAndDelete({ clientId, id });
    return NextResponse.json({ ok: true });
  } catch {
    return serverError();
  }
}
