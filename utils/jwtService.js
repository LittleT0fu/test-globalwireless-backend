const jwt = require("jsonwebtoken");

/**
 * สร้าง JWT token
 * @param {object} data - ข้อมูลที่จะเก็บใน token
 * @returns {string} JWT token
 */
exports.signToken = (data) => {
    const payload = {
        id: data.id,
    };

    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return token;
    } catch (error) {
        throw new Error("เกิดข้อผิดพลาดในการสร้าง token");
    }
};

/**
 * ตรวจสอบ JWT token
 * @param {string} token - JWT token
 * @returns {object} ข้อมูลที่อยู่ใน token
 */
exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error("เกิดข้อผิดพลาดในการตรวจสอบ token");
    }
};
