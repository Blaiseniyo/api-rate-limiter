import { Response, NextFunction } from "express";
import { ErrorResponse } from "./interfaces";
import {
  redisClient,
  ALLOWED_SOFT_THROTTLING_REQUESTS_PER_USER,
  ALLOWED_SOFT_THROTTLING_REQUESTS_DELAY,
} from "../utils/constants";

// Function to set error response
function setErrorResponse(
  res: Response,
  status: string,
  code: string,
  detail: string
) {
  const errorResponse: ErrorResponse = {
    status,
    code,
    detail,
  };
  return res.status(Number(code)).json(errorResponse);
}

// Middleware function for rate limiting
const slidingWindowLimiter = async (
  res: Response,
  next: NextFunction,
  key: string,
  windowSize: number,
  MaxRequestPerWindow: number
): Promise<any> => {
  const now = Date.now();
  const windowStart = now - windowSize * 1000;

  try {

    const pipeline = redisClient.multi();
    pipeline.zremrangebyscore(key, 0, windowStart); // Remove old entries
    pipeline.zcard(key); // Get the number of requests made within the time window

    const [_, count]: any = await pipeline.exec();

    if (count[1] >= MaxRequestPerWindow) {
      if (
        count[1] <
        MaxRequestPerWindow + ALLOWED_SOFT_THROTTLING_REQUESTS_PER_USER
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, ALLOWED_SOFT_THROTTLING_REQUESTS_DELAY)
        );
      } else {
        return setErrorResponse(
          res,
          "error",
          "429",
          "Too many requests. Please try again later."
        );
      }
    }
    pipeline.zadd(key, now, now.toString());
    pipeline.expire(key, windowSize);
    await pipeline.exec();

    next();
  } catch (error) {
    return setErrorResponse(res, "error", "500", "Internal server error");
  }
};

export default slidingWindowLimiter;
