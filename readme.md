# GlobalWireless Backend

Backend API สำหรับ GlobalWireless Project

## ความต้องการของระบบ

-   Node.js (เวอร์ชัน 14.0.0 หรือสูงกว่า)
-   npm (Node Package Manager)
-   MySQL Database
-   Docker | Docker Desktop

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
      # Database Local
      - DATABASE_URL
      - NODE_ENV
      - PORT
      # JWT
      - JWT_SECRET
      - JWT_EXPIRES_IN
      # Rate Limit
      - RATE_LIMIT_WINDOW_MS
      - RATE_LIMIT_MAX_REQUESTS
      # Bcrypt
      - BCRYPT_ROUNDS
      - ALLOWED_ORIGINS
```

## การรันโปรเจค can run with docker

### การเตรียมฐานข้อมูล

-   สร้างฐานข้อมูล MySQL ตามชื่อที่กำหนดในไฟล์ .env
-   รันคำสั่งเพื่อสร้างตารางและข้อมูลเริ่มต้น (ถ้ามี):

```bash
npm run db:setup
```

### การรันด้วย Docker

#### การรันครั้งแรก

```bash
# รันโปรเจคด้วย Docker (รวมการตั้งค่าฐานข้อมูล)
npm run docker:first-run
```

คำสั่งนี้จะ:

-   สร้างและรัน containers ทั้งหมด (Node.js, MySQL, phpMyAdmin)
-   รอให้ MySQL พร้อมใช้งาน
-   รันการตั้งค่าฐานข้อมูลอัตโนมัติ

#### คำสั่ง Docker อื่นๆ

````bash
# รันโปรเจค
npm run docker:up

# หยุดการทำงาน
npm run docker:down

# สร้าง image ใหม่
npm run docker:build

# ดู logs
npm run docker:logs

# รีเซ็ตทั้งหมด (ลบข้อมูลและรันใหม่)
npm run docker:reset



### 2. การรันในโหมดต่างๆ

#### โหมด Development

```bash
npm run dev
````

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

#### การเข้าถึงแอปพลิเคชัน

หลังจากรันด้วย Docker แล้ว:

-   **Backend API**: http://localhost:3000
-   **phpMyAdmin**: http://localhost:8080
    -   Username: `root`
    -   Password: `root`

#### การตั้งค่า Docker

โปรเจคใช้ Docker Compose ที่ประกอบด้วย:

-   **Node.js Server**: รันแอปพลิเคชันหลัก
-   **MySQL Database**: ฐานข้อมูล
-   **phpMyAdmin**: เครื่องมือจัดการฐานข้อมูล

ไฟล์การตั้งค่า:

-   `docker-compose.yml`: กำหนดการตั้งค่า services
-   `Dockerfile`: กำหนดการสร้าง Node.js image

### 4. การตรวจสอบการทำงาน

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

4. ถ้าเจอปัญหาเกี่ยวกับ Docker:
    - ตรวจสอบว่า Docker Desktop ทำงานอยู่
    - ลองรัน `docker system prune` เพื่อลบข้อมูลที่ไม่ใช้
    - ตรวจสอบว่า ports 3000, 3306, 8080 ไม่ถูกใช้งาน

### User Routes

-   `POST /users/login` - เข้าสู่ระบบ
-   `POST /users/register` - สมัครสมาชิก
-   `GET /users` - ดึงข้อมูลผู้ใช้ทั้งหมด (ต้องการการยืนยันตัวตนและสิทธิ์ "get_user")
-   `POST /users` - สร้างผู้ใช้ใหม่ (ต้องการการยืนยันตัวตนและสิทธิ์ "create_user")
-   `PATCH /users/:id` - อัปเดตข้อมูลผู้ใช้ (ต้องการการยืนยันตัวตนและสิทธิ์ "edit_user")
-   `DELETE /users/:id` - ลบผู้ใช้ (ต้องการการยืนยันตัวตนและสิทธิ์ "delete_user")

```

```
