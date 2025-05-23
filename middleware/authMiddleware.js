const { verifyToken } = require("../utils/jwtService");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        const tokenValue = token.split(" ")[1];

        const decoded = verifyToken(tokenValue);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
};
