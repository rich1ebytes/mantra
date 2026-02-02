
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createTestUser() {
    const suffix = Math.floor(Math.random() * 100000);
    const username = `testuser_${suffix}`;

    try {
        const user = await prisma.user.create({
            data: {
                email: `test_${suffix}@bypass.com`,
                username: username,
                displayName: "Bypass User",
                role: "READER"
            }
        });
        console.log(JSON.stringify(user));
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser();
