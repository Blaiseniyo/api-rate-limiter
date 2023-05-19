import { Request, Response, NextFunction } from "express";
import {
  SYSTEM_REQUESTS_WINDOW_SIZE_IN_SECONDS,
  MAX_SYSTEM_REQUESTS_PER_WINDOW,
} from "../utils/constants";

import fixedWindowRateLimiter from "../utils/fixedWindow";

// Middleware to enforce rate limiting over the entire system
const systemRequestLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await fixedWindowRateLimiter(
    res,
    next,
    "system_requests",
    SYSTEM_REQUESTS_WINDOW_SIZE_IN_SECONDS,
    MAX_SYSTEM_REQUESTS_PER_WINDOW
  );
};

export default systemRequestLimiterMiddleware;
