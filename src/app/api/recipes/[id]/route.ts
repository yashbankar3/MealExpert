import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { RecipeModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
  servingsDefault: z.number().positive(),
  ingredients: z.array(z.object({ name: z.string(), quantity: z.number(), unit: z.string() })),
  steps: z.array(z.string()),
  updatedAt: z.string()
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    const { id } = await params;
    const item = await RecipeModel.findOne({ clientId, id }).lean();
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return serverError();
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const body = updateSchema.parse(await request.json());
    await connectToDatabase();
    const { id } = await params;
    const item = await RecipeModel.findOneAndUpdate({ clientId, id }, { ...body }, { new: true }).lean();
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
    await RecipeModel.findOneAndDelete({ clientId, id });
    return NextResponse.json({ ok: true });
  } catch {
    return serverError();
  }
}
