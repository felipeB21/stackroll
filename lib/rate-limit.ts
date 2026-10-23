const rateLimitMap = new Map<string, number>();

export function checkRateLimit(identifier: string, windowMs = 5000): boolean {
  const now = Date.now();
  const lastRequestTime = rateLimitMap.get(identifier);

  if (lastRequestTime && now - lastRequestTime < windowMs) {
    return false;
  }

  rateLimitMap.set(identifier, now);

  if (rateLimitMap.size > 10000) {
    const threshold = now - windowMs;
    for (const [key, time] of rateLimitMap.entries()) {
      if (time < threshold) rateLimitMap.delete(key);
    }
  }

  return true;
}
