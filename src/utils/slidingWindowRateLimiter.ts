import { Response, NextFunction } from "express";
import {
  redisGetAsync,
  redisExpireAsync,
  redisSetAsync,
} from "../utils/constants";


// Middleware function for rate limiting
const slidingWindowLimiter = async (
    res: Response,
    next: NextFunction,
    key: string,
    windowSize: number,
    MaxRequestPerWindow: number
) => {
    
  try {
    // Get the current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Calculate the window start time
    const windowStartTime = currentTimestamp - windowSize;

    // Get the number of requests made within the sliding window
    const requestsMade = await redisGetAsync(key);

    if (requestsMade) {
      // If requests have been made within the sliding window
      const requestCount = parseInt(requestsMade, 10);

      if (requestCount >= MaxRequestPerWindow) {
        // If the maximum number of requests has been exceeded
        return res.status(429).json({
          status: "error",
          code: "429",
          detail:
            "To many requests please try again later or purchase more request tokens",
        });
      }

      // Increment the request count by 1
      await redisSetAsync(key, requestCount + 1);

      // Set the expiration time for the sliding window
      await redisExpireAsync(key, windowSize);
    } else {
      // If no requests have been made within the sliding window
      await redisSetAsync(key, 1);

      // Set the expiration time for the sliding window
      await redisExpireAsync(key, windowSize);
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default slidingWindowLimiter;
