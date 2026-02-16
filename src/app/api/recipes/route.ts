import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { RecipeModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
  servingsDefault: z.number().positive(),
  ingredients: z.array(z.object({ name: z.string(), quantity: z.number(), unit: z.string() })),
  steps: z.array(z.string())
});

export async function GET(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    const records = await RecipeModel.find({ clientId }).lean();
    return NextResponse.json(records);
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const body = createSchema.parse(await request.json());
    await connectToDatabase();
    const now = new Date().toISOString();
    const record = await RecipeModel.create({ ...body, id: crypto.randomUUID(), clientId, createdAt: now, updatedAt: now });
    return NextResponse.json(record.toObject(), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return badRequest(error.message);
    return serverError();
  }
}
