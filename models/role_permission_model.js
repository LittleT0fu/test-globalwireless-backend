// src/models/role-permission.model.ts
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ข้อมูลที่จำเป็นสำหรับความสัมพันธ์ระหว่างบทบาทและสิทธิ์
 * @typedef {Object} RolePermissionData
 * @property {number} id
 * @property {number} role_id - รหัสบทบาท
 * @property {number} permission_id - รหัสสิทธิ์
 */

const RolePermissionModel = {
    // สร้างความสัมพันธ์ระหว่างบทบาทและสิทธิ์
    create: async (data) => {
        if (!data.role_id || !data.permission_id) {
            throw new Error("Missing required fields");
        }

        return prisma.role_permission.create({
            data,
        });
    },

    // ค้นหาสิทธิ์ของบทบาท
    findPermissionsByRoleId: async (role_id) => {
        return prisma.role_permission.findMany({
            where: { role_id },
            include: {
                permission: true,
            },
        });
    },

    // ลบความสัมพันธ์ระหว่างบทบาทและสิทธิ์
    delete: async (id) => {
        return prisma.role_Permission.delete({
            where: { id },
        });
    },
};

module.exports = RolePermissionModel;
