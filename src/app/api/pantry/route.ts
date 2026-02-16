import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { PantryModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const createSchema = z.object({ name: z.string(), quantity: z.number(), unit: z.string(), lowStockThreshold: z.number() });

export async function GET(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    return NextResponse.json(await PantryModel.find({ clientId }).lean());
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const body = createSchema.parse(await request.json());
    const record = await PantryModel.create({ ...body, id: crypto.randomUUID(), clientId, updatedAt: new Date().toISOString() });
    return NextResponse.json(record.toObject(), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return badRequest(error.message);
    return serverError();
  }
}
