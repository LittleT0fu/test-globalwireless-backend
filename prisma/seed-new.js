const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting to seed database...");

  // สร้าง permissions
  const permissions = await Promise.all([
    prisma.permissions.upsert({
      where: { name: "get_user" },
      update: {},
      create: { name: "get_user" },
    }),
    prisma.permissions.upsert({
      where: { name: "edit_user" },
      update: {},
      create: { name: "edit_user" },
    }),
    prisma.permissions.upsert({
      where: { name: "delete_user" },
      update: {},
      create: { name: "delete_user" },
    }),
    prisma.permissions.upsert({
      where: { name: "create_user" },
      update: {},
      create: { name: "create_user" },
    }),
  ]);

  console.log("✅ Permissions created:", permissions.length);

  // สร้าง roles
  const roles = await Promise.all([
    prisma.roles.upsert({
      where: { name: "user" },
      update: {},
      create: { name: "user" },
    }),
    prisma.roles.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin" },
    }),
  ]);

  console.log("✅ Roles created:", roles.length);

  // สร้าง admin user
  const adminUser = await prisma.users.upsert({
    where: { email: "admin@email.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@email.com",
      password: bcrypt.hashSync("123456", 10),
      role: "admin",
    },
  });

  console.log("✅ Admin user created:", adminUser.email);

  // สร้าง role-permission relationships
  const userRole = await prisma.roles.findUnique({ where: { name: "user" } });
  const adminRole = await prisma.roles.findUnique({ where: { name: "admin" } });
  
  const getPermission = await prisma.permissions.findUnique({ where: { name: "get_user" } });
  const editPermission = await prisma.permissions.findUnique({ where: { name: "edit_user" } });
  const deletePermission = await prisma.permissions.findUnique({ where: { name: "delete_user" } });
  const createPermission = await prisma.permissions.findUnique({ where: { name: "create_user" } });

  // User role permissions
  await prisma.roles_permissions.upsert({
    where: {
      role_id_permission_id: {
        role_id: userRole.id,
        permission_id: getPermission.id,
      },
    },
    update: {},
    create: {
      role_id: userRole.id,
      permission_id: getPermission.id,
    },
  });

  // Admin role permissions
  await Promise.all([
    prisma.roles_permissions.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: getPermission.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: getPermission.id,
      },
    }),
    prisma.roles_permissions.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: editPermission.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: editPermission.id,
      },
    }),
    prisma.roles_permissions.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: deletePermission.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: deletePermission.id,
      },
    }),
    prisma.roles_permissions.upsert({
      where: {
        role_id_permission_id: {
          role_id: adminRole.id,
          permission_id: createPermission.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        permission_id: createPermission.id,
      },
    }),
  ]);

  console.log("✅ Role-permission relationships created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });