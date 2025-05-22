# GlobalWireless Backend

Backend API สำหรับ GlobalWireless Project

## ความต้องการของระบบ

-   Node.js (เวอร์ชัน 14.0.0 หรือสูงกว่า)
-   npm (Node Package Manager)
-   MySQL Database

## การติดตั้ง

1. Clone โปรเจค:

```bash
git clone [repository-url]
cd globalwireless-backend
```

2. ติดตั้ง dependencies:

```bash
npm install
```

3. สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจค และกำหนดค่าต่างๆ ดังนี้:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

## การรันโปรเจค

### โหมด Development

```bash
npm run dev
```

คำสั่งนี้จะรัน server ในโหมด development โดยใช้ nodemon ซึ่งจะ restart server อัตโนมัติเมื่อมีการแก้ไขโค้ด

### โหมด Production

```bash
npm start
```

### โหมด Debug

```bash
npm run debug
```

คำสั่งนี้จะรัน server ในโหมด debug ซึ่งสามารถใช้ Chrome DevTools หรือ VS Code เพื่อ debug ได้

## การเข้าถึง API

Server จะทำงานที่ port 3000 (หรือตามที่กำหนดใน .env)

-   URL: `http://localhost:3000`

## โครงสร้างโปรเจค
