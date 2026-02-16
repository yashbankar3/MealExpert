import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/server/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "DB connection failed" }, { status: 500 });
  }
}
