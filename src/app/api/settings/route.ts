import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/server/mongodb";
import { SettingsModel } from "@/lib/server/models";
import { badRequest, getClientId, serverError } from "@/lib/server/api";

export async function GET(request: NextRequest) {
  const clientId = getClientId(request);
  if (!clientId) return badRequest("Missing clientId");
  try {
    await connectToDatabase();
    return NextResponse.json(await SettingsModel.find({ clientId }).lean());
  } catch {
    return serverError();
  }
}
