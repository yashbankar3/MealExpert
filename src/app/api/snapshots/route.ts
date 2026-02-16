import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/server/mongodb";
import { SnapshotModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

const postSchema = z.object({ lowStockCount: z.number().int().nonnegative() });

export async function GET(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    return NextResponse.json(await SnapshotModel.find({ clientId }).sort({ date: 1 }).lean());
  } catch {
    return serverError();
  }
}

export async function POST(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    const { lowStockCount } = postSchema.parse(await request.json());
    await connectToDatabase();
    const now = new Date().toISOString();
    const record = await SnapshotModel.create({ id: crypto.randomUUID(), clientId, lowStockCount, date: now, updatedAt: now });
    return NextResponse.json(record.toObject(), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return badRequest(error.message);
    return serverError();
  }
}

export async function DELETE(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return badRequest("Missing id");
  try {
    await connectToDatabase();
    await SnapshotModel.findOneAndDelete({ clientId, id });
    return NextResponse.json({ ok: true });
  } catch {
    return serverError();
  }
}
