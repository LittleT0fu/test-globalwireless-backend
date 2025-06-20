const { PrismaClient } = require("@prisma/client");
const seed = require("./seed");

async function setupDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log("🔧 เริ่มต้นการตั้งค่าฐานข้อมูล...");

        // check database connection
        await prisma.$connect();
        console.log("✅ database connected successfully");

        // run migration
        console.log("🔄 running migrations...");
        const { exec } = require("child_process");
        const { promisify } = require("util");
        const execAsync = promisify(exec);

        try {
            await execAsync("npx prisma migrate deploy");
            console.log("✅ migrations completed successfully \n");
        } catch (migrationError) {
            console.log(
                "⚠️  migrations may have problems or already run:",
                migrationError.message
            );
        }

        // run seeding
        await seed();

        console.log("🎉 database setup completed successfully \n");
    } catch (error) {
        console.error("❌ error:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    setupDatabase().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

module.exports = setupDatabase;
