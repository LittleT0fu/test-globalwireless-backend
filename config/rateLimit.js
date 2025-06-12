const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 100, // จำกัด request ต่อ IP ที่ 100 ครั้งต่อ windowMs
});

module.exports = limiter;
