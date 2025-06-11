const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
            const user = req.user;

            //get permission
            const permissionName = await prisma.permission.findMany({
                where: {
                    role_id: user.role_id,
                },
            });

            //extract permission name
            const userPermissions = permissionName.map((p) => p.name);

            //check permission
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
            next({
                status: "error",
                statusCode: 500,
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
