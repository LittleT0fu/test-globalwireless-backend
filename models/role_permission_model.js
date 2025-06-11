// src/models/role-permission.model.ts
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const roleModel = require("./role_model");
const permissionModel = require("./permission_model");

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
            select: {
                id: true,
                role_id: true,
                permission_id: true,
                permission: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    },

    // ลบความสัมพันธ์ระหว่างบทบาทและสิทธิ์
    delete: async (id) => {
        return prisma.role_permission.delete({
            where: { id },
        });
    },

    // ค้นหาชื่อสิทธิ์จากชื่อบทบาท
    findPermissionNamesByRoleName: async (roleName) => {
        // 1. ค้นหา role_id จากชื่อบทบาท
        const role = await roleModel.findByName(roleName);
        if (!role) {
            throw new Error("Role not found");
        }
        console.log(role);

        // 2. ค้นหาสิทธิ์ทั้งหมดของบทบาทนั้น
        const rolePermissions =
            await RolePermissionModel.findPermissionsByRoleId(role.id);

        console.log(rolePermissions);

        // 3. แปลงผลลัพธ์ให้ได้เฉพาะชื่อสิทธิ์
        return rolePermissions.map((rp) => rp.permission.name);
    },
};

module.exports = RolePermissionModel;
