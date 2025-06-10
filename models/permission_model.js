const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ข้อมูลที่จำเป็นสำหรับสิทธิ์
 * @typedef {Object} PermissionData
 * @property {number} id
 * @property {string} name - ชื่อสิทธิ์
 */

const permissionModel = {
    create: async (data) => {
        if (!data.name) {
            throw new Error("Missing required fields");
        }

        return prisma.permission.create({
            data,
        });
    },

    findById: async (id) => {
        return prisma.permission.findUnique({
            where: { id },
        });
    },

    findByName: async (name) => {
        return prisma.permission.findUnique({
            where: { name },
        });
    },

    update: async (id, data) => {
        return prisma.permission.update({
            where: { id },
            data,
        });
    },

    delete: async (id) => {
        return prisma.permission.delete({
            where: { id },
        });
    },
};

module.exports = permissionModel;
