const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `ไม่พบ route ที่ต้องการ: ${req.originalUrl}`,
        error: "Not Found",
    });
};

module.exports = notFoundHandler;
