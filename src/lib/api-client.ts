import type {
  ApiErrorBody,
  DemoUser,
  FeedResponse,
  MatchesResponse,
  ResetResponse,
  SwipeAction,
  SwipeResponse,
} from "@/types";

/** Error thrown for any non-2xx API response (or a network failure). */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", ...init });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Can't reach the server. Check your connection.");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      response.status,
      body?.error.code ?? "UNKNOWN_ERROR",
      body?.error.message ?? "Something went wrong. Please try again.",
    );
  }
  return (await response.json()) as T;
}

export const api = {
  getFeed: () => request<FeedResponse>("/api/feed"),

  getMe: async (): Promise<DemoUser> => (await request<{ user: DemoUser }>("/api/me")).user,

  getMatches: () => request<MatchesResponse>("/api/matches"),

  swipe: (profileId: string, action: SwipeAction) =>
    request<SwipeResponse>("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, action }),
    }),

  resetDemo: () => request<ResetResponse>("/api/demo/reset", { method: "POST" }),
};
