// backend/middlewares/rateLimiter.js

const requestCounts = new Map();  // To track request count for each user
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;   // Max number of requests per window

const rateLimiter = (req, res, next) => {
  const userIP = req.ip; // Or use JWT: req.user.id for user identification
  const now = Date.now();
  let rateData = requestCounts.get(userIP) || { count: 0, startTime: now };

  // If the rate limit window has passed, reset the count
  if (now - rateData.startTime > RATE_LIMIT_WINDOW_MS) {
    rateData = { count: 0, startTime: now };
  }

  // Increment the request count for this user
  rateData.count += 1;
  requestCounts.set(userIP, rateData);

  // If the user has exceeded the request limit, reject the request
  if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
};

module.exports = rateLimiter;
