import { Response, NextFunction } from "express";
import slidingWindowLimiter  from "../utils/slidingWindowRateLimiter";
import {
  redisClient,
} from "../utils/constants";

jest.mock("../utils/constants", () => ({
  redisClient: {
    multi: jest.fn(),
  },
  ALLOWED_SOFT_THROTTLING_REQUESTS_PER_USER: 5,
  ALLOWED_SOFT_THROTTLING_REQUESTS_DELAY: 1000,
}));

describe("Rate Limiter middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should return an error response when rate limit is exceeded", async () => {
    const mockPipeline = {
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([null, [null, 20]]),
    };

    (redisClient.multi as jest.Mock).mockReturnValue(mockPipeline);

    await slidingWindowLimiter(
      mockResponse as Response,
      nextFunction,
      "test",
      60,
      10
    );

    expect(mockResponse.status).toHaveBeenCalledWith(429);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      code: "429",
      detail: "Too many requests. Please try again later.",
    });
  });

  it("should introduce a delay to the request when the number of requests exceeded the allowed limit by still with in the allowed throrrling", async () => {
    const mockPipeline = {
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([null, [null, 13]]),
    };

    (redisClient.multi as jest.Mock).mockReturnValue(mockPipeline);

    await slidingWindowLimiter(
      mockResponse as Response,
      nextFunction,
      "test",
      60,
      10
    );

    expect(mockPipeline.zadd).toHaveBeenCalled();
    expect(mockPipeline.expire).toHaveBeenCalled();
    expect(mockPipeline.exec).toHaveBeenCalled();

  });

  it("should call the next middleware when the request is within limit", async () => {
    const mockPipeline = {
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([null, [null, 5]]),
    };

    (redisClient.multi as jest.Mock).mockReturnValue(mockPipeline);

    await slidingWindowLimiter(
      mockResponse as Response,
      nextFunction,
      "test",
      60,
      10
    );

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should return an internal server error when a Redis error occurs", async () => {
    const mockPipeline = {
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error("Redis error")),
    };

    (redisClient.multi as jest.Mock).mockReturnValue(mockPipeline);

    await slidingWindowLimiter(
      mockResponse as Response,
      nextFunction,
      "test",
      60,
      10
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "error",
      code: "500",
      detail: "Internal server error",
    });
  });
});
