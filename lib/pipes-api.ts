import "server-only";
import { getEnv } from "./env";

type PipesApiFetchOptions = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

export async function pipesApiFetch<T>(
  options: PipesApiFetchOptions
): Promise<T> {
  const { PIPES_APP_API_KEY, PIPES_API_BASE_URL } = getEnv();

  const res = await fetch(`${PIPES_API_BASE_URL}${options.path}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${PIPES_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      const json = JSON.parse(text);
      message = json.error?.message || json.message || text;
    } catch {
      message = text;
    }
    throw new Error(`Pipes API error (${res.status}): ${message}`);
  }

  return res.json() as Promise<T>;
}
