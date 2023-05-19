import Redis from "ioredis";


// Middleware to enforce rate limiting
const userRequestLimiterMiddleware = (redisClient: Redis, redis_key: string, duration: any) => {
  // Rate limit for the user/API key
  redisClient
    .multi()
    .incr(redis_key)
    .expire(redis_key, duration) // Expire in duration time
    .exec((err: any, results: any) => {
      if (!err) {
        return results[0][1];
      }

    });
};

export default userRequestLimiterMiddleware;
