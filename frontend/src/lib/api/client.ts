import { apiUrl } from "./urls";
import type { ApiError } from "@/types/models";

class ApiRequestError extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.msg || `Request failed with status ${status}`);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  token?: string | null;
}

const TOKEN_KEY = "codesync_token";

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, params, headers: extraHeaders, token } = options;

  const url = new URL(apiUrl(endpoint));
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  const authToken = token ?? (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null);
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("codesync_token");
      localStorage.removeItem("codesync_user");
      window.location.href = "/login";
    }
    let errorBody: ApiError;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = { msg: `Request failed with status ${res.status}` };
    }
    throw new ApiRequestError(res.status, errorBody);
  }

  return res.json() as Promise<T>;
}
