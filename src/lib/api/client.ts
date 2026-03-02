/**
 * API client for A2A Settlement Exchange
 * Uses NEXT_PUBLIC_USE_MOCK to switch between mock and real exchange
 */

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_EXCHANGE_URL || "http://localhost:3000";
};

const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true";
};

const getDashboardApiKey = (): string => {
  return process.env.NEXT_PUBLIC_DASHBOARD_API_KEY || "";
};

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  const authHeaders: Record<string, string> = {};
  const apiKey = getDashboardApiKey();
  if (apiKey) {
    authHeaders["Authorization"] = `Bearer ${apiKey}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as unknown as T;
  }
}

export { getBaseUrl, getDashboardApiKey, isMockMode };
