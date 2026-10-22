export function rateLimit({ max, windowMs }) {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    if (hits.size > 5000) hits.clear();
    const key = req.ip ?? 'unknown';
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
    if (recent.length >= max) {
      res
        .status(429)
        .json({ message: 'Too many messages. Please try again later or email directly.' });
      return;
    }
    hits.set(key, [...recent, now]);
    next();
  };
}
