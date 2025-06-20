const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// ตรวจสอบ environment variables ที่จำเป็น
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL", "NODE_ENV"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
}

// ตรวจสอบความยาวของ JWT_SECRET
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
        "⚠️  Warning: JWT_SECRET should be at least 32 characters long for security"
    );
}

// Configuration object
const config = {
    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",

    // Database
    databaseUrl: process.env.DATABASE_URL,

    // JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",

    // CORS
    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["http://localhost:3000"],

    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

    // Security
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,

    // Validation
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
    isTest: process.env.NODE_ENV === "test",
};

module.exports = config;
