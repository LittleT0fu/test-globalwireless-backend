const { verifyToken } = require("../utils/jwtService");
const pool = require("../config/database");

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        const tokenValue = token.split(" ")[1];

        const decoded = verifyToken(tokenValue);

        const user = await pool.query("SELECT * FROM users WHERE id = ?", [
            decoded.id,
        ]);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
};
