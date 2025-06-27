const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ข้อมูลที่จำเป็นสำหรับผู้ใช้งาน
 * @typedef {Object} UserData
 * @property {number} id
 * @property {string} name - ชื่อผู้ใช้งานa
 * @property {string} email - อีเมลผู้ใช้งาน (ต้องไม่ซ้ำกัน)
 * @property {string} password - รหัสผ่าน
 * @property {string} role - บทบาทของผู้ใช้งาน
 */

const tableName = "users";

const userModel = {
    create: async (data) => {
        // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
        if (!data.name || !data.email || !data.password) {
            throw new Error("Missing required fields");
        }

        const userData = {
            ...data,
            role: data.role || "user",
        };

        return prisma[tableName].create({
            data: userData,
        });
    },

    getAll: async () => {
        return prisma[tableName].findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    },

    findById: async (id) => {
        return prisma[tableName].findUnique({
            where: { id },
        });
    },

    findByEmail: async (email) => {
        return prisma[tableName].findUnique({
            where: { email },
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
            where: {
                id: Number(id), // แปลง id เป็นตัวเลข
            },
        });
    },
};

module.exports = userModel;
