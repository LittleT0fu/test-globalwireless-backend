

exports.getAllUsers = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "ดึงข้อมูลผู้ใช้ทั้งหมดสำเร็จ",
            data: {
                users: [],
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
            error: error.message,
        });
    }
};


