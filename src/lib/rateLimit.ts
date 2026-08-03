/**
 * Limitation de fréquence en mémoire, par instance de fonction serverless.
 * Best-effort : les instances Vercel sont éphémères, mais combiné au honeypot
 * ça suffit à décourager les abus grossiers sans recourir à un captcha.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export function clientKeyFromRequest(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
