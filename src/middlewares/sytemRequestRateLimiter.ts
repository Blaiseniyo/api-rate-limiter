import { Request, Response, NextFunction } from "express";
import {
  redisClient,
  SYSTEM_REQUESTS_WINDOW_SIZE_IN_SECONDS,
  MAX_SYSTEM_REQUESTS_PER_WINDOW,
} from "../utils/constants";


// Middleware to enforce rate limiting over the entire system
const systemRequestLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Rate limit for the system
  redisClient
    .multi()
    .incr("system_requests")
    .expire("system_requests", SYSTEM_REQUESTS_WINDOW_SIZE_IN_SECONDS) // Set Expire time for the key
    .exec((err: any, results: any) => {

      if (err) {
        return res.sendStatus(500);
      }

      const systemRequests = results[0][1];

      if (systemRequests > MAX_SYSTEM_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          status: "error",
          code: "429",
          detail: "To many requests in a minute please try again later",
        });
      }
      next();
    });
};

export default systemRequestLimiterMiddleware;
