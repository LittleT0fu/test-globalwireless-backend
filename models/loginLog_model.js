const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * ข้อมูลที่จำเป็นสำหรับบันทึกการเข้าสู่ระบบ
 * @typedef {Object} LoginLogData
 * @property {number} id
 * @property {number} userId - ID ของผู้ใช้งาน
 * @property {string} ipAddress - IP address ที่ใช้เข้าสู่ระบบ
 * @property {string} userAgent - User agent ของ browser
 * @property {Date} loginAt - เวลาที่เข้าสู่ระบบ
 * @property {boolean} isSuccess - สถานะการเข้าสู่ระบบสำเร็จหรือไม่
 */

const loginLogModel = {
    create: async (data) => {
        // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
        if (!data.req) {
            throw new Error("Missing required fields");
        }

        const logData = {
            status: data.status,
            ip_address: data.req.ip,
            user_agent: data.req.headers["user-agent"],
            ...(data.user_id && { user: { connect: { id: data.user_id } } }),
        };

        return prisma.login_log.create({
            data: logData,
        });
    },

    getAll: async () => {
        return prisma.login_log.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    },

    findByUserId: async (userId) => {
        return prisma.login_log.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                loginAt: "desc",
            },
        });
    },

    getRecentLogs: async (limit = 10) => {
        return prisma.login_log.findMany({
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
};

module.exports = loginLogModel;
