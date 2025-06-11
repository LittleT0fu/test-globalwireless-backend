const { encryptPassword, comparePassword } = require("../utils/passwordUtils");
const { signToken } = require("../utils/jwtService");
const { PrismaClient } = require("@prisma/client");

//models
const userModel = require("../models/user_model");
const rolePermissionModel = require("../models/role_permission_model");
const roleModel = require("../models/role_model");
const permissionModel = require("../models/permission_model");
//prisma
const prisma = new PrismaClient();

// get all users
//@route GET /users
//@access Public
exports.getAllUsers = async (req, res) => {
    try {
        // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
        const users = await userModel.getAll();

        // ส่ง response กลับ
        res.status(200).json({
            status: "success",
            message: "ดึงข้อมูลผู้ใช้สำเร็จ",
            data: users,
        });
    } catch (error) {
        next({
            status: "error",
            statusCode: 500,
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
            error: error.message,
            location: "getAllUsers function",
            details: {
                operation: "user retrieval",
            },
        });
    }
};

// create user
//@route POST /users
//@access Admin
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // ตรวจสอบอีเมลซ้ำ
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return next({
                status: "error",
                statusCode: 409,
                message: "Email นี้มีอยู่ในระบบแล้ว",
            });
        }

        // รอให้การเข้ารหัสรหัสผ่านเสร็จสิ้น
        const hashedPassword = await encryptPassword(password);

        // เพิ่มผู้ใช้ใหม่
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // ส่ง response กลับ
        res.status(201).json({
            status: "success",
            statusCode: 201,
            message: "สร้างผู้ใช้สำเร็จ",
            data: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        next({
            status: "error",
            statusCode: 500,
            message: "เกิดข้อผิดพลาดในการสร้างผู้ใช้",
            error: error.message,
            location: "createUser function",
            details: {
                operation: "user creation",
                attemptedData: { name, email },
            },
        });
    }
};

// create user
//@route POST /users/register
//@access Public
exports.createUserPublic = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // รอให้การเข้ารหัสรหัสผ่านเสร็จสิ้น
        const hashedPassword = await encryptPassword(password);

        // ตรวจสอบอีเมลซ้ำ
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return next({
                status: "error",
                statusCode: 400,
                message: "Email นี้มีอยู่ในระบบแล้ว",
            });
        }

        // เพิ่มผู้ใช้ใหม่
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // ส่ง response กลับ
        res.status(201).json({
            status: "success",
            statusCode: 201,
            message: "สร้างผู้ใช้สำเร็จ",
            data: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        next({
            // ส่งข้อมูล error ที่ชัดเจน
            status: "error",
            statusCode: 500,
            message: "เกิดข้อผิดพลาดในการสร้างผู้ใช้",
            location: "createUserPublic",
            error: error.message,
            details: {
                operation: "user creation",
                attemptedData: { name, email },
            },
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
        const userExist = await userModel.findById(id);
        if (!userExist) {
            return next({
                status: "error",
                statusCode: 404,
                message: "ไม่พบผู้ใช้งาน",
            });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;

        const updatedUser = await userModel.update(id, updateData);

        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "อัพเดตผู้ใช้สำเร็จ",
            data: {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        next({
            status: "error",
            statusCode: 500,
            message: "เกิดข้อผิดพลาดในการอัพเดตผู้ใช้",
            error: error.message,
            location: "updateUser",
            details: {
                operation: "user update",
                attemptedData: { name, email },
            },
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
        const userExist = await userModel.findById(id);
        if (!userExist) {
            return next({
                status: "error",
                statusCode: 404,
                message: "ไม่พบผู้ใช้งาน",
            });
        }

        // ลบผู้ใช้
        const deletedUser = await userModel.delete(id);

        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "ลบผู้ใช้สำเร็จ",
            data: {
                name: deletedUser.name,
                email: deletedUser.email,
                role: deletedUser.role,
            },
        });
    } catch (error) {
        next({
            status: "error",
            statusCode: 500,
            message: "เกิดข้อผิดพลาดในการลบผู้ใช้",
            error: error.message,
            location: "deleteUser",
            details: {
                operation: "user deletion",
            },
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkEmail = await userModel.findByEmail(email);
        if (!checkEmail) {
            return next({
                status: "error",
                statusCode: 401,
                message: "ไม่พบอีเมลนี้ในระบบ",
            });
        }

        const user = checkEmail;
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return next({
                status: "error",
                statusCode: 401,
                message: "รหัสผ่านไม่ถูกต้อง",
            });
        }

        // 1. หา role_id จาก role name
        const role = await roleModel.findByName(user.role);

        if (!role) {
            return next({
                status: "error",
                statusCode: 404,
                message: "ไม่พบข้อมูล role",
            });
        }

        // *!
        // 2. หา permission_id จาก role_id ในตาราง Role_Permission
        const rolePermissions =
            await rolePermissionModel.findPermissionsByRoleId(role.id);

        // 3. หา permission name จาก permission_id
        const userPermission = rolePermissions.map((rp) => rp.permission.name);

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

exports.getProfile = async (req, res) => {
    try {
        // ดึง token จาก header
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "ไม่พบ Token ในการยืนยันตัวตน",
            });
        }

        // ดึงข้อมูลผู้ใช้จาก token
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "ไม่พบข้อมูลผู้ใช้",
            });
        }
        res.status(200).json({
            status: "success",
            message: "ดึงข้อมูลผู้ใช้สำเร็จ",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
            error: error.message,
        });
    }
};
