const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ข้อมูลที่จำเป็นสำหรับบทบาท
 * @typedef {Object} RoleData
 * @property {number} id
 * @property {string} name - ชื่อบทบาท
 */

const roleModel = {
    create: async (data) => {
        if (!data.name) {
            throw new Error("Missing required fields");
        }

        return prisma.role.create({
            data,
        });
    },

    findById: async (id) => {
        return prisma.role.findUnique({
            where: { id },
        });
    },

    findByName: async (name) => {
        return prisma.role.findUnique({
            where: { name },
        });
    },

    update: async (id, data) => {
        return prisma.role.update({
            where: { id },
            data,
        });
    },

    delete: async (id) => {
        return prisma.role.delete({
            where: { id },
        });
    },
};

module.exports = roleModel;
