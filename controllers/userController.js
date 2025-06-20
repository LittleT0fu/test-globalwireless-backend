const { encryptPassword, comparePassword } = require("../utils/passwordUtils");
const { signToken } = require("../utils/jwtService");
const { PrismaClient } = require("@prisma/client");

//models
const userModel = require("../models/user_model");
const rolePermissionModel = require("../models/role_permission_model");
const roleModel = require("../models/role_model");
const loginLogModel = require("../models/loginLog_model");

//prisma
const prisma = new PrismaClient();

// get all users
//@route GET /users
//@access Public
exports.getAllUsers = async (req, res) => {
    try {
        // get all users from database
        const users = await userModel.getAll();

        // send response
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
        });
    }
};

// create user
//@route POST /users
//@access Admin
exports.createUser = async (req, res) => {
    try {
        // get value from request
        const { name, email, password, role } = req.body;

        // check email already used
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return next({
                status: "error",
                statusCode: 409,
                message: "Email นี้มีอยู่ในระบบแล้ว",
            });
        }

        // encrypt password
        const hashedPassword = await encryptPassword(password);

        // create new user
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // send response
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
        // get value from request
        const { name, email, password } = req.body;

        // encrypt password
        const hashedPassword = await encryptPassword(password);

        // check email already used
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return next({
                status: "error",
                statusCode: 400,
                message: "Email นี้มีอยู่ในระบบแล้ว",
            });
        }

        // create new user
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // send response
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
        // get value from request
        const { id } = req.params;
        const { name, email, role } = req.body;

        // check user exist on database
        const userExist = await userModel.findById(id);
        if (!userExist) {
            return next({
                status: "error",
                statusCode: 404,
                message: "ไม่พบผู้ใช้งาน",
            });
        }

        // check email already used by other user
        if (email) {
            const emailExists = await userModel.findByEmail(email);
            if (emailExists) {
                return next({
                    status: "error",
                    statusCode: 400,
                    message: "อีเมลนี้ถูกใช้งานแล้ว",
                });
            }
        }

        // check role exist on database
        if (role) {
            const roleExists = await roleModel.findByName(role);
            if (!roleExists) {
                return next({
                    status: "error",
                    statusCode: 400,
                    message: "ไม่พบ role ที่ระบุในระบบ",
                });
            }
        }

        // check data to update if data is not undefined
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;

        // update user data on database
        const updatedUser = await userModel.update(id, updateData);

        // response data
        const responseData = {
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        };

        // send response
        res.status(200).json({
            status: "success",
            message: "อัพเดตผู้ใช้สำเร็จ",
            data: responseData,
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
        //  get value from request
        const { id } = req.params;
        const { user } = req.user;

        // check id is number
        if (isNaN(id)) {
            return next({
                status: "error",
                statusCode: 400,
                message: "รหัสผู้ใช้ต้องเป็นตัวเลขเท่านั้น",
            });
        }

        // check user try to delete own account
        if (user.id === parseInt(id)) {
            return next({
                status: "error",
                statusCode: 403,
                message: "ไม่สามารถลบบัญชีผู้ใช้ตัวเองได้",
            });
        }

        // check user exist
        const userExist = await userModel.findById(id);
        if (!userExist) {
            return next({
                status: "error",
                statusCode: 404,
                message: "ไม่พบผู้ใช้งาน",
            });
        }

        // delete user
        const deletedUser = await userModel.delete(id);

        // send response
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

        const user = await userModel.findByEmail(email);
        if (!user) {
            // create login log when login failed
            await loginLogModel.create({
                user_id: null,
                status: false,
                req: req,
            });
            return next({
                status: "error",
                statusCode: 401,
                message: "ไม่พบอีเมลนี้ในระบบ",
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            // create login log when login failed
            await loginLogModel.create({
                user_id: user.id,
                status: false,
                req: req,
            });
            return next({
                status: "error",
                statusCode: 401,
                message: "รหัสผ่านไม่ถูกต้อง",
            });
        }

        // find user role
        const role = await roleModel.findByName(user.role);

        if (!role) {
            return next({
                status: "error",
                statusCode: 404,
                message: "ไม่พบข้อมูล role",
            });
        }

        // find user permission
        const rolePermissions =
            await rolePermissionModel.findPermissionsByRoleId(role.id);

        // get user permission name
        const userPermission = rolePermissions.map((rp) => rp.permission.name);

        // create token
        const token = signToken({ id: user.id });

        // create login log when login success
        await loginLogModel.create({
            user_id: user.id,
            status: true,
            req: req,
        });

        // send response
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
