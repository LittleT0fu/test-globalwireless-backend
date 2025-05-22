const mysql = require("mysql2/promise");
const dbConfig = require("./db.config");

// สร้าง connection pool
const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
});

// ทดสอบการเชื่อมต่อกับ MySQL
pool.getConnection((err, connection) => {
    if (err) {
        console.error("error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database");
    connection.release();
});

// ส่งออก pool เพื่อใช้ในไฟล์อื่น
module.exports = pool;
