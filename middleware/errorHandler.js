//error handler
//@desc Error handler

const errorHandler = (err, req, res, next) => {
    // กำหนดค่า default status code และ error message
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // จัดการ error ตามประเภท
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value entered";
    }

    // ส่ง response กลับไปยัง client
    res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
        // เพิ่มเติมสำหรับ error object ที่ custom
        error: err.error || undefined,
        location: err.location || undefined,
        details: err.details || undefined,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = errorHandler;
