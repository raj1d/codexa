/**
 * Sentry client/server error logger for Next.js
 */

export function captureClientError(error: unknown, context?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, { extra: context });
  } else {
    console.error("[Client Error]", error, context);
  }
}
