const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const rolePermissionModel = require("../models/role_permission_model");

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
            const permissionName =
                await rolePermissionModel.findPermissionsByRoleId(user.role_id);

            //extract permission name
            const userPermissions = permissionName.map(
                (p) => p.permissions.name
            );

            //check permission
            const hasPermission = permissions.every((perm) =>
                userPermissions.includes(perm)
            );

            if (!hasPermission) {
                return next({
                    status: "error",
                    statusCode: 403,
                    message: "ไม่มีสิทธิ์ในการเข้าถึง",
                });
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
