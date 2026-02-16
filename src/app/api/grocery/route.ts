import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { GroceryModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const createSchema = z.object({ name: z.string(), quantity: z.number(), unit: z.string(), checked: z.boolean(), source: z.enum(["manual", "plan"]), category: z.string() });

export async function GET(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    return NextResponse.json(await GroceryModel.find({ clientId }).lean());
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const body = createSchema.parse(await request.json());
    const now = new Date().toISOString();
    const record = await GroceryModel.create({ ...body, id: crypto.randomUUID(), clientId, createdAt: now, updatedAt: now });
    return NextResponse.json(record.toObject(), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return badRequest(error.message);
    return serverError();
  }
}
