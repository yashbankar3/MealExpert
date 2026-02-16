import { getOrCreateClientId } from "@/lib/client-id";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const clientId = getOrCreateClientId();
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({ error: "Request failed" }))) as { error?: string };
    throw new Error(body.error ?? "Request failed");
  }

  return response.json() as Promise<T>;
}
