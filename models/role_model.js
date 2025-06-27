const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ข้อมูลที่จำเป็นสำหรับบทบาท
 * @typedef {Object} RoleData
 * @property {number} id
 * @property {string} name - ชื่อบทบาท
 */

const tableName = "roles";

const roleModel = {
    create: async (data) => {
        if (!data.name) {
            throw new Error("Missing required fields");
        }

        return prisma[tableName].create({
            data,
        });
    },

    getAll: async () => {
        return prisma[tableName].findMany({
            select: {
                id: true,
                name: true,
            },
        });
    },

    findManyById: async (ids) => {
        return prisma[tableName].findMany({
            where: {
                id: { in: ids },
            },
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

module.exports = roleModel;
