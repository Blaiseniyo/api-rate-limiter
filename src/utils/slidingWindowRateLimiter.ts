import { Response, NextFunction } from "express";
import { redisClient } from "../utils/constants";


// Middleware function for rate limiting
const slidingWindowLimiter = async (
  res: Response,
  next: NextFunction,
  key: string,
  windowSize: number,
  MaxRequestPerWindow: number
) => {

  const now = Date.now();
  const windowStart = now - windowSize * 1000;

  try {
    const pipeline = redisClient.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart); // Remove old entries

    // Get the number of requests made within the time window
    pipeline.zcard(key);
    const [_, count]: any = await pipeline.exec();

    // Get the key count on the index one of the count array
    if (count[1] >= MaxRequestPerWindow) {
      // If requests exceeds rate limite return an error
      return res.status(429).json({
        status: "error",
        code: "429",
        detail: "To many requests in a minute please try again later",
      });
    }

    // Add the current request to the sorted set
    pipeline.zadd(key, now, now.toString());
    pipeline.expire(key, windowSize);
    await pipeline.exec();

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: "500",
      detail: "Internal server error",
    });
  }
};

export default slidingWindowLimiter;
