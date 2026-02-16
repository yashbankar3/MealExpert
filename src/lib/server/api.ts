import { NextResponse, type NextRequest } from "next/server";

export function getClientId(request: NextRequest): string | null {
  return request.headers.get("x-client-id") ?? request.nextUrl.searchParams.get("clientId");
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}
