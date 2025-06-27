const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ข้อมูลที่จำเป็นสำหรับสิทธิ์
 * @typedef {Object} PermissionData
 * @property {number} id
 * @property {string} name - ชื่อสิทธิ์
 */

const tableName = "permissions";

const permissionModel = {
    create: async (data) => {
        if (!data.name) {
            throw new Error("Missing required fields");
        }

        return prisma[tableName].create({
            data,
        });
    },

    getManyById: async (ids) => {
        return prisma[tableName].findMany({
            where: { id: { in: ids } },
        });
    },

    findById: async (id) => {
        return prisma[tableName].findUnique({
            where: { id },
        });
    },

    findByName: async (name) => {
        return prisma[tableName].findFirst({
            where: { name },
        });
    },

    update: async (id, data) => {
        return prisma[tableName].update({
            where: { id },
            data,
        });
    },

    delete: async (id) => {
        return prisma[tableName].delete({
            where: { id },
        });
    },
};

module.exports = permissionModel;
