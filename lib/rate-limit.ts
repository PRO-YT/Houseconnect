type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function assertRateLimit(
  key: string,
  config: { limit: number; windowMs: number },
) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }

  if (current.count >= config.limit) {
    return false;
  }

  current.count += 1;
  buckets.set(key, current);
  return true;
}
