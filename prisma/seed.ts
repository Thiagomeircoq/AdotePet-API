import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const roles = [{ name: "ADMIN" }, { name: "USER" }, { name: "MODERATOR" }];

    for (const role of roles) {
        await prisma.tbrole.upsert({
            where: { name: role.name },
            update: {},
            create: { name: role.name },
        });
    }

    console.log("Roles seeded!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
