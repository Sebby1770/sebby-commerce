import type { NextRequest } from "next/server";

type RateLimitOptions = {
  scope: string;
  limit: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function getClientKey(request: NextRequest, scope: string) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  return `${scope}:${ip}`;
}

function cleanupExpiredBuckets(now: number) {
  if (buckets.size < 1000) {
    return;
  }

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function applyRateLimit(
  request: NextRequest,
  { scope, limit, windowMs }: RateLimitOptions
) {
  const now = Date.now();
  cleanupExpiredBuckets(now);

  const key = getClientKey(request, scope);
  const existing = buckets.get(key);
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  buckets.set(key, bucket);

  const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
  const remaining = Math.max(0, limit - bucket.count);
  const headers = new Headers({
    "Retry-After": retryAfterSeconds.toString(),
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(bucket.resetAt).toISOString()
  });

  if (bucket.count > limit) {
    return Response.json(
      { error: "Too many requests. Please retry shortly." },
      { status: 429, headers }
    );
  }

  return null;
}
