const { verifyToken } = require("../utils/jwtService");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userModel = require("../models/user_model");

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return next({
                status: "error",
                statusCode: 401,
                message: "Invalid token format",
            });
        }
        const tokenValue = token.split(" ")[1];

        const decoded = verifyToken(tokenValue);

        //get data from database
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return next({
                status: "error",
                statusCode: 401,
                message: "Unauthorized",
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return next({
            status: "error",
            statusCode: 401,
            message: "invalid token",
        });
    }
};
