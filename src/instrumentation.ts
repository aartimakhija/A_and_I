// Captures the FULL, unredacted error for anything Next.js would otherwise
// hide from the browser in production ("the specific message is omitted in
// production builds"). This hook always gets the real error server-side —
// it shows up in Vercel's Runtime Logs (Project → Logs) even when the page
// itself only shows a digest. Keep this in place; it costs nothing and is
// the fastest way to see what actually broke on any future 500.
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string },
  context: { routePath: string; routeType: string }
) {
  console.error("[onRequestError]", {
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    error: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
  });
}
