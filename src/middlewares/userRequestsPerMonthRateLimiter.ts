import { Request, Response, NextFunction } from "express";
import {
  USER_MONTHLY_REQUEST_WINDOW_SIZE_IN_SECONDS,
  USER_MAX_SYSTEM_REQUESTS_PER_WINDOW,
} from "../utils/constants";

import fixedWindowRateLimiter from "../utils/fixedWindow";

// Middleware to enforce rate limiting on the user request per month
const userRequestLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const { api_key } = req.query; // Assuming the API key is passed in the query string
    const key = `${api_key}`
    await fixedWindowRateLimiter(
        res,
        next,
        key,
        USER_MONTHLY_REQUEST_WINDOW_SIZE_IN_SECONDS,
        USER_MAX_SYSTEM_REQUESTS_PER_WINDOW
    );
};

export default userRequestLimiterMiddleware;
