import { Request, Response, NextFunction } from "express";
import {
  redisGetAsync,
  redisExpireAsync,
  redisSetAsync,
  WINDOW_SIZE_IN_SECONDS,
  MAX_REQUESTS_PER_WINDOW,
} from "../utils/constants";



// Middleware function for rate limiting
const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientIP = req.ip; // Assuming the IP address is used for identification

    // Get the current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);
    console.log(currentTimestamp);
    // Calculate the window start time
    const windowStartTime = currentTimestamp - WINDOW_SIZE_IN_SECONDS;

    // Get the number of requests made within the sliding window
    const requestsMade = await redisGetAsync(clientIP);

    if (requestsMade) {
      // If requests have been made within the sliding window
      const requestCount = parseInt(requestsMade, 10);

      if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
        // If the maximum number of requests has been exceeded
        return res.status(429).json({ error: "Too Many Requests" });
      }

      // Increment the request count by 1
      await redisSetAsync(clientIP, requestCount + 1);

      // Set the expiration time for the sliding window
      await redisExpireAsync(clientIP, WINDOW_SIZE_IN_SECONDS);
    } else {
      // If no requests have been made within the sliding window
      await redisSetAsync(clientIP, 1);

      // Set the expiration time for the sliding window
      await redisExpireAsync(clientIP, WINDOW_SIZE_IN_SECONDS);
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default rateLimiter;
