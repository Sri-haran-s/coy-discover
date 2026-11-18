import { NextResponse } from "next/server";
import { AppError } from "./errors";

/** JSON response that is never cached (swipe state changes constantly). */
export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function errorResponse(err: unknown) {
  if (err instanceof AppError) {
    return json({ error: { code: err.code, message: err.message } }, err.status);
  }
  console.error("[api] unexpected error:", err);
  return json(
    { error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } },
    500,
  );
}

/** Wraps a route handler so thrown errors become consistent JSON responses. */
export function route<A extends unknown[]>(handler: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (err) {
      return errorResponse(err);
    }
  };
}
