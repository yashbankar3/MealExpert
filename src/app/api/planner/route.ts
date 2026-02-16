import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { PlannerModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const createSchema = z.object({ weekStart: z.string(), dayIndex: z.number(), slot: z.enum(["breakfast", "lunch", "dinner"]), recipeId: z.string().optional(), customMeal: z.string().optional() });

export async function GET(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    const weekStart = request.nextUrl.searchParams.get("weekStart");
    const query = weekStart ? { clientId, weekStart } : { clientId };
    return NextResponse.json(await PlannerModel.find(query).lean());
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
    const record = await PlannerModel.create({ ...body, id: crypto.randomUUID(), clientId, createdAt: now, updatedAt: now });
    return NextResponse.json(record.toObject(), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return badRequest(error.message);
    return serverError();
  }
}
