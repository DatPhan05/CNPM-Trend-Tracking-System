import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

// stdTTL: default time to live in seconds (10 minutes)
// checkperiod: automatic delete check interval (15 minutes)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 900 });

export const cacheMiddleware = (duration: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Override res.json to capture the response and cache it
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};
