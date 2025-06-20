const rateLimit = require("express-rate-limit");
const config = require("./env");

const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
});

module.exports = limiter;
