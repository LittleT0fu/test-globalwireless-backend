const { encryptPassword, comparePassword } = require("../utils/passwordUtils");
const { signToken } = require("../utils/jwtService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ... existing code ...

//old
// const pool = require("../config/database");

// get all users
//@route GET /users
//@access Public
exports.getAllUsers = async (req, res) => {
    try {
        // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

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
        const checkEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (checkEmail) {
            return res
                .status(400)
                .json({ message: "Email นี้มีอยู่ในระบบแล้ว" });
        }

        // เพิ่มผู้ใช้ใหม่
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: "user",
            },
        });

        console.log(newUser);
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
        const userExists = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!userExists) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.status(200).json({
            status: "success",
            message: "อัพเดตผู้ใช้สำเร็จ",
            result: updatedUser,
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
        const userExists = await prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            where: { id: parseInt(id) },
        });

        if (!userExists) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
        }

        // ลบผู้ใช้
        const deletedUser = await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.status(200).json({
            status: "success",
            message: "ลบผู้ใช้สำเร็จ",
            result: deletedUser,
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

        const checkEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (!checkEmail) {
            return res.status(401).json({
                status: "error",
                statusCode: 401,
                statusText: "Email Not Found",
                message: "ไม่พบอีเมลนี้ในระบบ",
            });
        }

        const user = checkEmail;
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                statusCode: 401,
                statusText: "Wrong Password",
                message: "รหัสผ่านไม่ถูกต้อง",
            });
        }

        // 1. หา role_id จาก role name
        const role = await prisma.role.findFirst({
            where: {
                name: user.role,
            },
            select: {
                id: true,
            },
        });

        if (!role) {
            return res.status(404).json({
                status: "error",
                message: "ไม่พบข้อมูล role",
            });
        }

        // 2. หา permission_id จาก role_id ในตาราง Role_Permission
        const rolePermissions = await prisma.role_permission.findMany({
            where: {
                role_id: role.id,
            },
            select: {
                permission_id: true,
            },
        });

        // 3. หา permission name จาก permission_id
        const getUserPermission = await prisma.permission.findMany({
            where: {
                id: {
                    in: rolePermissions.map((rp) => rp.permission_id),
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        const userPermission = getUserPermission.map((p) => p.name);

        const token = signToken({ id: user.id });

        res.status(200).json({
            status: "success",
            statusCode: 200,
            statusText: "Login Success",
            message: "เข้าสู่ระบบสำเร็จ",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                permission: userPermission,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            statusCode: 500,
            statusText: "Internal Server Error",
            message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
            error: error.message,
        });
    }
};
