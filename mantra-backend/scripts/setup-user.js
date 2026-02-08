
import { supabaseAdmin } from "../src/config/supabase.js";
import prisma from "../src/config/prisma.js";

async function setupTestUser() {
    const email = "test@mantra.com";
    const password = "Password123!";
    const username = "tester";

    console.log(`🔨 Setting up test user: ${email}`);

    // 1. Create in Supabase Auth (admin bypasses rate limits/confirmation)
    let authUserId;
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = listData.users.find(u => u.email === email);

    if (existingUser) {
        console.log("✅ User already exists in Supabase Auth");
        authUserId = existingUser.id;
    } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { username, displayName: "Test User" }
        });

        if (error) {
            console.error("❌ Failed to create Supabase user:", error.message);
            process.exit(1);
        }
        console.log("✅ Created new Supabase user");
        authUserId = data.user.id;
    }

    // 2. Sync to Prisma DB
    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                id: authUserId, // Match Supabase UID
                email,
                username,
                displayName: "Test User",
                role: "READER"
            }
        });
        console.log(`✅ Synced with Database (ID: ${user.id})`);
    } catch (err) {
        // If connection fails, it might be due to user existing with different ID or other unique constraints
        // Try to find by email to confirming logic
        console.error("⚠ Database sync warning:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

setupTestUser();
