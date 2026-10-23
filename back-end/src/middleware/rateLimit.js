const MAX_CLIENTS = 5000;

/**
 * Allows each client (by IP) `max` requests per `windowMs`. The counts live in this server
 * instance's memory, so they reset on a cold start and are not shared between instances.
 */
export function rateLimit({
  max,
  windowMs,
  message = 'Too many messages. Please try again later or email directly.',
}) {
  const hits = new Map();

  const forgetExpired = (now) => {
    for (const [key, times] of hits) if (now - times.at(-1) >= windowMs) hits.delete(key);
  };

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip ?? 'unknown';
    if (!hits.has(key) && hits.size >= MAX_CLIENTS) forgetExpired(now);
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
    // A table still full of active clients turns new ones away instead of forgetting everyone.
    if (recent.length >= max || (!hits.has(key) && hits.size >= MAX_CLIENTS)) {
      res.status(429).json({ message });
      return;
    }
    hits.set(key, [...recent, now]);
    next();
  };
}
