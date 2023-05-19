import express, {Application} from "express";
import apiRoutes from "./routes/index"
import systemRequestLimiterMiddleware from "./middlewares/sytemRequestRateLimiter";
import userRequestLimiterMiddleware from './middlewares/userRequestsRateLimiter';
import rateLimiter from './middlewares/slidingWindowLimiter';


// Express app
const app:Application = express()
app.use(express.json());

// Apply rate limiter middleware to all requests
// app.use(userRequestLimiterMiddleware);
// app.use(systemRequestLimiterMiddleware);
app.use(rateLimiter);

// Your routes and handlers go here...
app.use("/api/v1/nofication", apiRoutes);
const PORT = process.env.PORT || 4000
// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
