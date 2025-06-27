const Joi = require("joi");

// main validation function
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // แสดง error ทั้งหมดแทนที่จะหยุดที่ error แรก
            allowUnknown: true, // อนุญาตให้มี field ที่ไม่ได้กำหนดใน schema
            stripUnknown: true, // ลบ field ที่ไม่ได้กำหนดใน schema ออก
        });

        if (error) {
            const errorMessages = error.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message,
            }));

            return next({
                status: "error",
                statusCode: 400,
                message: errorMessages,
                errors: errorMessages,
                location: "validation middleware",
            });
        }

        // ถ้า validation ผ่าน ให้ใช้ข้อมูลที่ผ่านการ validate แล้ว
        req.body = value;
        next();
    };
};

// Schema สำหรับการสร้างผู้ใช้งาน
const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.base": "ชื่อต้องเป็นตัวอักษร",
        "string.empty": "ชื่อไม่สามารถเป็นค่าว่างได้",
        "string.min": "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร",
        "string.max": "ชื่อต้องไม่เกิน 100 ตัวอักษร",
        "any.required": "ชื่อจำเป็นต้องระบุ",
    }),

    email: Joi.string().email().required().messages({
        "string.base": "อีเมลต้องเป็นตัวอักษร",
        "string.empty": "อีเมลไม่สามารถเป็นค่าว่างได้",
        "string.email": "รูปแบบอีเมลไม่ถูกต้อง",
        "any.required": "อีเมลจำเป็นต้องระบุ",
    }),

    password: Joi.string().min(8).required().messages({
        "string.base": "รหัสผ่านต้องเป็นตัวอักษร",
        "string.empty": "รหัสผ่านไม่สามารถเป็นค่าว่างได้",
        "string.min": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
        "any.required": "รหัสผ่านจำเป็นต้องระบุ",
    }),

    role: Joi.string().valid("admin", "user", "moderator").optional().messages({
        "string.base": "บทบาทต้องเป็นตัวอักษร",
        "any.only": "บทบาทต้องเป็น admin, user หรือ moderator เท่านั้น",
    }),
});

// Schema สำหรับการเข้าสู่ระบบ
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "อีเมลต้องเป็นตัวอักษร",
        "string.empty": "อีเมลไม่สามารถเป็นค่าว่างได้",
        "string.email": "รูปแบบอีเมลไม่ถูกต้อง",
        "any.required": "อีเมลจำเป็นต้องระบุ",
    }),

    password: Joi.string().required().messages({
        "string.base": "รหัสผ่านต้องเป็นตัวอักษร",
        "string.empty": "รหัสผ่านไม่สามารถเป็นค่าว่างได้",
        "any.required": "รหัสผ่านจำเป็นต้องระบุ",
    }),
});

// Schema สำหรับการสร้างผู้ใช้งานแบบ public (ไม่มี role)
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        "string.base": "ชื่อต้องเป็นตัวอักษร",
        "string.empty": "ชื่อไม่สามารถเป็นค่าว่างได้",
        "string.min": "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร",
        "string.max": "ชื่อต้องไม่เกิน 100 ตัวอักษร",
        "any.required": "ชื่อจำเป็นต้องระบุ",
    }),

    email: Joi.string().email().required().messages({
        "string.base": "อีเมลต้องเป็นตัวอักษร",
        "string.empty": "อีเมลไม่สามารถเป็นค่าว่างได้",
        "string.email": "รูปแบบอีเมลไม่ถูกต้อง",
        "any.required": "อีเมลจำเป็นต้องระบุ",
    }),

    password: Joi.string().min(8).required().messages({
        "string.base": "รหัสผ่านต้องเป็นตัวอักษร",
        "string.empty": "รหัสผ่านไม่สามารถเป็นค่าว่างได้",
        "string.min": "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
        "any.required": "รหัสผ่านจำเป็นต้องระบุ",
    }),
});

// Schema สำหรับการอัปเดตผู้ใช้งาน
const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
        "string.base": "ชื่อต้องเป็นตัวอักษร",
        "string.empty": "ชื่อไม่สามารถเป็นค่าว่างได้",
        "string.min": "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร",
        "string.max": "ชื่อต้องไม่เกิน 100 ตัวอักษร",
    }),

    email: Joi.string().email().optional().messages({
        "string.base": "อีเมลต้องเป็นตัวอักษร",
        "string.empty": "อีเมลไม่สามารถเป็นค่าว่างได้",
        "string.email": "รูปแบบอีเมลไม่ถูกต้อง",
    }),

    role: Joi.string().valid("admin", "user", "moderator").optional().messages({
        "string.base": "บทบาทต้องเป็น string",
        "any.only": "บทบาทต้องเป็น admin, user หรือ moderator เท่านั้น",
    }),
});

// Export middleware functions
module.exports = {
    validateCreateUser: validate(createUserSchema),
    validateLogin: validate(loginSchema),
    validateRegister: validate(registerSchema),
    validateUpdateUser: validate(updateUserSchema),
};
