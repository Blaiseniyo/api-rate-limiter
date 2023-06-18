import Redis from "ioredis";


// Redis client
export const redisClient = new Redis(process.env.REDIS_URL);

// Set the window size and request limit for user request per month
export const USER_MONTHLY_REQUEST_WINDOW_SIZE_IN_SECONDS = 60 * 60 * 24 * 30; // 1 month
export const USER_MAX_SYSTEM_REQUESTS_PER_WINDOW = 10000;

// Set the window size and request limit for entire system per minute
export const SYSTEM_REQUESTS_WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
export const MAX_SYSTEM_REQUESTS_PER_WINDOW = 100;

// Set the sliding window size and request limit for user request in same widow
export const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 10;


export const ALLOWED_SOFT_THROTTLING_REQUESTS_PER_USER = 3;
export const ALLOWED_SOFT_THROTTLING_REQUESTS_DELAY = 1000; // in milleseconds
