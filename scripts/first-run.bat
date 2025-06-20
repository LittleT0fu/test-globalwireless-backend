@echo off
echo 🚀 เริ่มต้นการรันโปรเจคครั้งแรก...

echo �� ลบ containers เดิม...
docker-compose down -v

echo 🔧 สร้างและรัน containers...
docker-compose up -d

echo ⏳ รอให้ MySQL พร้อมใช้งาน...
timeout /t 20 /nobreak

echo �� รัน database setup...
docker-compose exec node-server node prisma/db-setup.js

echo ✅ การตั้งค่าเสร็จสิ้น! แอปพลิเคชันพร้อมใช้งานที่ http://localhost:3000
echo 📊 phpMyAdmin พร้อมใช้งานที่ http://localhost:8080
pause 