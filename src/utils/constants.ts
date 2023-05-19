import Redis from "ioredis";
import { promisify } from "util";


// Redis client
export const redisClient = new Redis(process.env.REDIS_URL);

// Promisify Redis commands
export const redisGetAsync = promisify(redisClient.get).bind(redisClient);
export const redisSetAsync = promisify(redisClient.set).bind(redisClient);
export const redisExpireAsync = promisify(redisClient.expire).bind(redisClient);
export const redisIncrAsync = promisify(redisClient.incr).bind(redisClient);



// Set the window size and request limit for user request per month
export const USER_MONTHLY_REQUEST_WINDOW_SIZE_IN_SECONDS = 60 * 60 * 24 * 30; // 1 month
export const USER_MAX_SYSTEM_REQUESTS_PER_WINDOW = 10000;

// Set the window size and request limit for entire system per minute
export const SYSTEM_REQUESTS_WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
export const MAX_SYSTEM_REQUESTS_PER_WINDOW = 100;

// Set the sliding window size and request limit for user request in same widow
export const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute
export const MAX_REQUESTS_PER_WINDOW = 10;
