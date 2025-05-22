const { encryptPassword, comparePassword } = require("../utils/passwordUtils");
const { signToken } = require("../utils/jwtService");

const pool = require("../config/database");

// get all users
//@route GET /users
//@access Public
exports.getAllUsers = async (req, res) => {
    try {
        // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
        const [users] = await pool.query(
            "SELECT id, name, email, role FROM users"
        );

        // ส่ง response กลับ
        res.status(200).json({
            status: "success",
            message: "ดึงข้อมูลผู้ใช้สำเร็จ",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
            error: error.message,
        });
    }
};

// create user
//@route POST /users
//@access Public
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // รอให้การเข้ารหัสรหัสผ่านเสร็จสิ้น
        const hashedPassword = await encryptPassword(password);

        // ตรวจสอบอีเมลซ้ำ
        const checkEmail = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (checkEmail[0].length > 0) {
            return res
                .status(400)
                .json({ message: "Email นี้มีอยู่ในระบบแล้ว" });
        }

        // เพิ่มผู้ใช้ใหม่
        const [result] = await pool.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        // ส่ง response กลับ
        res.status(201).json({
            status: "success",
            message: "สร้างผู้ใช้สำเร็จ",
            data: {
                name,
                email,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการสร้างผู้ใช้",
            error: error.message,
        });
    }
};

// update user
//@route PATCH /users/:id
//@access Public
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        // ตรวจสอบว่ามีผู้ใช้อยู่จริงหรือไม่
        const userExists = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (userExists[0].length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
        }

        //check data for update fields
        let updateFields = [];
        let updateValues = [];

        if (name !== undefined) {
            updateFields.push("name = ?");
            updateValues.push(name);
        }
        if (email !== undefined) {
            updateFields.push("email = ?");
            updateValues.push(email);
        }
        if (role !== undefined) {
            updateFields.push("role = ?");
            updateValues.push(role);
        }

        // ถ้าไม่มีฟิลด์ที่จะอัพเดต
        if (updateFields.length === 0) {
            return res.status(400).json({ message: "ไม่มีการอัพเดตข้อมูล" });
        }

        // เพิ่ม id เข้าไปใน parameters
        updateValues.push(id);

        const [result] = await pool.query(
            `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
            updateValues
        );

        res.status(200).json({
            status: "success",
            message: "อัพเดตผู้ใช้สำเร็จ",
            result: result,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการอัพเดตผู้ใช้",
            error: error.message,
        });
    }
};

// delete user
//@route DELETE /users/:id
//@access Public
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // ตรวจสอบว่ามีผู้ใช้อยู่จริงหรือไม่
        const userExists = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [id]
        );

        if (userExists[0].length === 0) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
        }

        // ลบผู้ใช้
        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
            id,
        ]);

        res.status(200).json({
            status: "success",
            message: "ลบผู้ใช้สำเร็จ",
            result: result,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการลบผู้ใช้",
            error: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ตรวจสอบอีเมลซ้ำ
        const checkEmail = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (checkEmail[0].length === 0) {
            return res.status(404).json({
                status: "error",
                message: "ไม่พบอีเมลนี้ในระบบ",
            });
        }

        const user = checkEmail[0][0];
        const isPasswordValid = comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "รหัสผ่านไม่ถูกต้อง",
            });
        }

        const token = signToken({ id: user.id });

        res.status(200).json({
            status: "success",
            message: "เข้าสู่ระบบสำเร็จ",
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
            error: error.message,
        });
    }
};
