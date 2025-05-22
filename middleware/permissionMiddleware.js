const verifyToken = require("../utils/jwtService");
const pool = require("../config/database");

/**
 * ตรวจสอบสิทธิ์ของผู้ใช้
 * @param {object} req - คำขอ HTTP
 * @param {object} res - คำตอบ HTTP
 * @param {function} next - ฟังก์ชันต่อไป
 */
exports.checkPermission = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "ไม่มี token" });
        }

        const decoded = verifyToken.verifyToken(token);

        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
            decoded.id,
        ]);

        if (!user) {
            return res.status(401).json({ message: "ไม่พบผู้ใช้งาน" });
        }

        // ตรวจสอบ role ของผู้ใช้
        if (req.originalUrl.startsWith("/users") && user[0].role !== "user") {
            return res.status(403).json({
                status: "error",
                message: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
            error: error.message,
        });
    }
};
