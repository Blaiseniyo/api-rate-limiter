import { Request, Response, NextFunction } from "express";
import {
  WINDOW_SIZE_IN_SECONDS,
  MAX_REQUESTS_PER_WINDOW,
} from "../utils/constants";

import slidingWindowLimiter from "../utils/slidingWindowRateLimiter";

// Middleware function for rate limiting
const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  const { api_key } = req.query; // Assuming the API key is passed in the query string
  const key = `user:${api_key}`;
  await slidingWindowLimiter(
    res,
    next,
    key,
    WINDOW_SIZE_IN_SECONDS,
    MAX_REQUESTS_PER_WINDOW
  );
};

export default rateLimiter;
