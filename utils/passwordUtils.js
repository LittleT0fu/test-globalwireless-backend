const bcrypt = require("bcrypt");

/**
 * เข้ารหัสรหัสผ่านด้วย bcrypt
 * @param {string} password - รหัสผ่านที่ต้องการเข้ารหัส
 * @returns {Promise<string>} รหัสผ่านที่เข้ารหัสแล้ว
 */
const encryptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน");
    }
};

/**
 * เปรียบเทียบรหัสผ่านที่ผู้ใช้ป้อนกับรหัสผ่านที่เข้ารหัสไว้
 * @param {string} password - รหัสผ่านที่ผู้ใช้ป้อน
 * @param {string} hashedPassword - รหัสผ่านที่เข้ารหัสไว้
 * @returns {Promise<boolean>} ผลการเปรียบเทียบ
 */
const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error("เกิดข้อผิดพลาดในการเปรียบเทียบรหัสผ่าน");
    }
};

module.exports = {
    encryptPassword,
    comparePassword,
};
