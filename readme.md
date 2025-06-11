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
PORT=3001
JWT_SECRET
DATABASE_URL

```

## การรันโปรเจค

### 1. การเตรียมฐานข้อมูล

-   สร้างฐานข้อมูล MySQL ตามชื่อที่กำหนดในไฟล์ .env
-   รันคำสั่งเพื่อสร้างตารางและข้อมูลเริ่มต้น (ถ้ามี):

```bash
npm run db:setup
```

### 2. การรันในโหมดต่างๆ

#### โหมด Development

```bash
npm run dev
```

-   Server จะรันที่ port 3000 (หรือตามที่กำหนดใน .env)
-   มีการ restart อัตโนมัติเมื่อมีการแก้ไขโค้ด
-   เหมาะสำหรับการพัฒนา

#### โหมด Production

```bash
npm start
```

-   Server จะรันในโหมด production
-   ไม่มีการ restart อัตโนมัติ
-   เหมาะสำหรับการใช้งานจริง

#### โหมด Debug

```bash
npm run debug
```

-   Server จะรันในโหมด debug
-   สามารถใช้ Chrome DevTools หรือ VS Code เพื่อ debug ได้
-   เหมาะสำหรับการแก้ไขปัญหา

### 3. การตรวจสอบการทำงาน

-   เปิดเบราว์เซอร์และเข้าถึง `http://localhost:3000`
-   ตรวจสอบ log ใน terminal เพื่อดูข้อผิดพลาด (ถ้ามี)
-   ใช้ Postman หรือเครื่องมืออื่นๆ เพื่อทดสอบ API

## การแก้ไขปัญหาเบื้องต้น

1. ถ้าไม่สามารถรันได้ ให้ตรวจสอบ:

    - Node.js และ npm ถูกติดตั้งถูกต้อง
    - ไฟล์ .env ถูกสร้างและกำหนดค่าถูกต้อง
    - ฐานข้อมูล MySQL ทำงานและสามารถเชื่อมต่อได้

2. ถ้าเจอปัญหาเกี่ยวกับ dependencies:

    ```bash
    npm clean-install
    ```

3. ถ้าเจอปัญหาเกี่ยวกับ port:
    - ตรวจสอบว่า port 3000 ไม่ถูกใช้งานโดยโปรแกรมอื่น
    - หรือเปลี่ยน port ในไฟล์ .env

## โครงสร้างโปรเจค

### User Routes

-   `POST /users/login` - เข้าสู่ระบบ
-   `POST /users/register` - สมัครสมาชิก
-   `GET /users` - ดึงข้อมูลผู้ใช้ทั้งหมด (ต้องการการยืนยันตัวตนและสิทธิ์ "get_user")
-   `POST /users` - สร้างผู้ใช้ใหม่ (ต้องการการยืนยันตัวตนและสิทธิ์ "create_user")
-   `PATCH /users/:id` - อัปเดตข้อมูลผู้ใช้ (ต้องการการยืนยันตัวตนและสิทธิ์ "edit_user")
-   `DELETE /users/:id` - ลบผู้ใช้ (ต้องการการยืนยันตัวตนและสิทธิ์ "delete_user")
