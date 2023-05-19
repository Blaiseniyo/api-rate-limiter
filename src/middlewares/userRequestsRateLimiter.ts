import { Request, Response, NextFunction } from "express";
import {
  redisClient,
  USER_MONTHLY_REQUEST_WINDOW_SIZE_IN_SECONDS,
  USER_MAX_SYSTEM_REQUESTS_PER_WINDOW,
} from "../utils/constants";


// Middleware to enforce rate limiting on the user request per month
const userRequestLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { api_key } = req.query; // Assuming the API key is passed in the query string

  // Rate limit for the user/API key
  redisClient
    .multi()
    .incr(`user_requests:${api_key}`)
    .expire(
      `user_requests:${api_key}`,
      USER_MONTHLY_REQUEST_WINDOW_SIZE_IN_SECONDS
    ) // Expire in 1 month
    .exec((err: any, results: any) => {
      if (err) {
        console.error("Error checking user rate limit:", err);
        return res.sendStatus(500);
      }

      const userRequests = results[0][1];

      if (userRequests > USER_MAX_SYSTEM_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          status: "error",
          code: "429",
          detail:
            "To many requests in a month please try again later or purchase more request tokens",
        });
      }

      next(); // Proceed to the next middleware or route handler
    });
};

export default userRequestLimiterMiddleware;
