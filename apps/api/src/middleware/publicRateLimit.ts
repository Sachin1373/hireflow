import { Request, Response, NextFunction } from "express";

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

type RateEntry = {
  count: number;
  resetAt: number;
};

const requestStore = new Map<string, RateEntry>();

const getClientKey = (req: Request) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0]?.trim();
  const ip = forwardedIp || req.ip || "unknown";
  return `${ip}:${req.path}`;
};

export const publicRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const key = getClientKey(req);
  const now = Date.now();
  const current = requestStore.get(key);

  if (!current || current.resetAt <= now) {
    requestStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }

  current.count += 1;
  requestStore.set(key, current);
  return next();
};
