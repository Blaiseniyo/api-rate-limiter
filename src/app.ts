import express, {Application} from "express";
import apiRoutes from "./routes/index"
import systemRequestLimiterMiddleware from "./middlewares/sytemRequestRateLimiter";
import userRequestPermonthLimiterMiddleware from './middlewares/userRequestsPerMonthRateLimiter';
import userRateLimiter from './middlewares/userRequestByWindowRateLimiter';


// Express app
const app:Application = express()
app.use(express.json());

// Apply rate limiter middleware to all requests
app.use(systemRequestLimiterMiddleware);
app.use(userRateLimiter);
app.use(userRequestPermonthLimiterMiddleware);

// Your routes and handlers go here...
app.use("/api/v1/nofication", apiRoutes);
const PORT = process.env.PORT || 4000
// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
