const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// ===============================seed data===============================
const seedData = {
    permissions: [
        { name: "get_user" },
        { name: "edit_user" },
        { name: "delete_user" },
        { name: "create_user" },
    ],
    roles: [{ name: "user" }, { name: "admin" }],
    roles_permissions: [
        { role_name: "user", permission_name: "get_user" },

        { role_name: "admin", permission_name: "get_user" },
        { role_name: "admin", permission_name: "edit_user" },
        { role_name: "admin", permission_name: "delete_user" },
        { role_name: "admin", permission_name: "create_user" },
    ],
    users: [
        {
            name: "admin",
            email: "admin@email.com",
            password: bcrypt.hashSync("123456", 10),
            role: "admin",
        },
    ],
};

// ===============================main functions===============================

async function seed() {
    console.log("🌱 start seeding data...");

    const existingData = await checkExistingData();
    if (await shouldSkipSeeding(existingData)) {
        console.log("❌ data already exists, skip seeding...");
        return;
    }

    // seed data
    await createPermissions();
    await createRoles();
    await createRolePermission();
    await createUsers();

    console.log("✅ data seeded successfully");
}

// ===============================check existing data===============================

async function checkExistingData() {
    const [
        existingPermissions,
        existingRoles,
        existingUsers,
        existingRolesPermissions,
    ] = await Promise.all([
        prisma.permissions.findMany(),
        prisma.roles.findMany(),
        prisma.users.findMany(),
        prisma.roles_permissions.findMany(),
    ]);

    return {
        permissions: existingPermissions,
        roles: existingRoles,
        users: existingUsers,
        rolesPermissions: existingRolesPermissions,
    };
}

async function shouldSkipSeeding(existingData) {
    return (
        existingData.users.length > 0 &&
        existingData.roles.length > 0 &&
        existingData.permissions.length > 0 &&
        existingData.rolesPermissions.length > 0
    );
}

// ===============================seed functions===============================

//* seed permissions
async function createPermissions() {
    console.log("🌱 seeding permissions...");
    for (const permission of seedData.permissions) {
        const existingPermission = await prisma.permissions.findFirst({
            where: { name: permission.name },
        });

        if (existingPermission) {
            console.log(
                `❌ permission ${permission.name} already exists, skipping...`
            );
            continue;
        }
        await prisma.permissions.create({ data: permission });
        console.log(`✅ permission ${permission.name} seeded successfully`);
    }
    console.log("✅ permissions seeded successfully \n");
}

//* seed roles
async function createRoles() {
    console.log("🌱 seeding roles...");
    for (const role of seedData.roles) {
        const existingRole = await prisma.roles.findFirst({
            where: { name: role.name },
        });

        if (existingRole) {
            console.log(`❌ role ${role.name} already exists, skipping...`);
            continue;
        }
        await prisma.roles.create({ data: role });
        console.log(`✅ role ${role.name} seeded successfully`);
    }
    console.log("✅ roles seeded successfully \n");
}

//* seed roles_permissions
async function createRolePermission() {
    console.log("🌱 seeding roles_permissions...");

    // get roles and permissions from database
    const [roles, permissions] = await Promise.all([
        prisma.roles.findMany(),
        prisma.permissions.findMany(),
    ]);

    // create map for search
    const roleMap = createNameToIdMap(roles);
    const permissionMap = createNameToIdMap(permissions);

    // create relationship between role and permission
    for (const rolePermission of seedData.roles_permissions) {
        await createAndMapRolePermission(
            rolePermission,
            roleMap,
            permissionMap
        );
    }

    console.log("✅ roles_permissions seeded successfully \n");
}

//* seed users
async function createUsers() {
    console.log("🌱 seeding users...");

    // check existing users
    for (const user of seedData.users) {
        const existingUser = await prisma.users.findFirst({
            where: { email: user.email },
        });

        if (existingUser) {
            console.log(`❌ user ${user.email} already exists, skip...`);
            continue;
        }
        await prisma.users.create({ data: user });
        console.log(`✅ user ${user.email} seeded successfully`);
    }
    console.log("✅ users seeded successfully \n");
}

// ===============================utility functions===============================

function createNameToIdMap(items) {
    return items.reduce((acc, item) => {
        acc[item.name] = item.id;
        return acc;
    }, {});
}

async function createAndMapRolePermission(
    rolePermission,
    roleMap,
    permissionMap
) {
    const roleId = roleMap[rolePermission.role_name];
    const permissionId = permissionMap[rolePermission.permission_name];

    if (!roleId || !permissionId) {
        console.log(`❌ role or permission not found, skip...`);
        return;
    }

    const existingRolePermission = await prisma.roles_permissions.findFirst({
        where: {
            role_id: roleId,
            permission_id: permissionId,
        },
    });

    if (existingRolePermission) {
        console.log(`❌ role and permission already exists, skip...`);
        return;
    }

    await prisma.roles_permissions.create({
        data: {
            role_id: roleId,
            permission_id: permissionId,
        },
    });

    console.log(
        `✅ create relationship between role ${rolePermission.role_name} and permission ${rolePermission.permission_name} successfully`
    );
}

// ===============================export===============================

if (require.main === module) {
    seed()
        .then(() => {
            console.log("🎉 Seeding completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Seeding failed:", error);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = seed;
