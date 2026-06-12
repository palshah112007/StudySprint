interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const map = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = map.get(ip);
  if (!entry || now > entry.resetAt) {
    map.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
