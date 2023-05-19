import { Response, NextFunction } from "express";
import {
  redisGetAsync,
  redisSetAsync,
  redisIncrAsync,
  redisExpireAsync,
} from "../utils/constants";

// Middleware to enforce rate limiting over the entire system

const fixedWindowRateLimiter = async (
  res: Response,
  next: NextFunction,
  key: string,
  windowSize: number,
  MaxRequestPerWindow: number
) => {

  // Get the current count from Redis
  const count = await redisGetAsync(key);

  if (count === null) {
    // Initialize the count if it doesn't exist
    await redisSetAsync(key, 1);
    await redisExpireAsync(key, windowSize);
    return next();
  }

  if (parseInt(count) <= MaxRequestPerWindow) {
    // Increment the count if it is within the limit
    await redisIncrAsync(key);
    return next();
  }

  return res.status(429).json({
    status: "error",
    code: "429",
    detail: "To many requests in a minute please try again later",
  });
};

export default fixedWindowRateLimiter;
