import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { GroceryModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const patchSchema = z.object({ name: z.string(), quantity: z.number(), unit: z.string(), checked: z.boolean(), source: z.enum(["manual", "plan"]), category: z.string(), updatedAt: z.string() });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const body = patchSchema.parse(await request.json());
    await connectToDatabase();
    const { id } = await params;
    const item = await GroceryModel.findOneAndUpdate({ clientId, id }, body, { new: true }).lean();
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
    await GroceryModel.findOneAndDelete({ clientId, id });
    return NextResponse.json({ ok: true });
  } catch {
    return serverError();
  }
}
