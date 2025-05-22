const verifyToken = require("../utils/jwtService");
const pool = require("../config/database");

/**
 * ตรวจสอบสิทธิ์ของผู้ใช้
 * @param {object} req - คำขอ HTTP
 * @param {object} res - คำตอบ HTTP
 * @param {function} next - ฟังก์ชันต่อไป
 */
exports.checkPermission =
    (...permissions) =>
    async (req, res, next) => {
        try {
            const user = req.user[0][0];

            //get permission
            const permissionName = await pool.query(
                "SELECT p.id, p.name FROM permission p INNER JOIN role_permission rp ON p.id = rp.permission_id INNER JOIN role r ON r.id = rp.role_id WHERE r.name = ?",
                [user.role]
            );

            //check permission
            const userPermissions = permissionName[0].map((p) => p.name);
            const hasPermission = permissions.some((p) =>
                userPermissions.includes(p)
            );

            if (!hasPermission) {
                return res
                    .status(403)
                    .json({ message: "ไม่มีสิทธิ์ในการเข้าถึง" });
            }

            next();
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
                error: error.message,
            });
        }
    };

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        next();
    };
};
