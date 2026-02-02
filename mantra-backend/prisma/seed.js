import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Origins ──
  const origins = await Promise.all([
    prisma.origin.upsert({
      where: { code: "IN" },
      update: {},
      create: { name: "India", code: "IN", flag: "🇮🇳", description: "News from India" },
    }),
    prisma.origin.upsert({
      where: { code: "US" },
      update: {},
      create: { name: "United States", code: "US", flag: "🇺🇸", description: "News from the United States" },
    }),
    prisma.origin.upsert({
      where: { code: "GB" },
      update: {},
      create: { name: "United Kingdom", code: "GB", flag: "🇬🇧", description: "News from the UK" },
    }),
    prisma.origin.upsert({
      where: { code: "JP" },
      update: {},
      create: { name: "Japan", code: "JP", flag: "🇯🇵", description: "News from Japan" },
    }),
    prisma.origin.upsert({
      where: { code: "DE" },
      update: {},
      create: { name: "Germany", code: "DE", flag: "🇩🇪", description: "News from Germany" },
    }),
    prisma.origin.upsert({
      where: { code: "BR" },
      update: {},
      create: { name: "Brazil", code: "BR", flag: "🇧🇷", description: "News from Brazil" },
    }),
    prisma.origin.upsert({
      where: { code: "AU" },
      update: {},
      create: { name: "Australia", code: "AU", flag: "🇦🇺", description: "News from Australia" },
    }),
    prisma.origin.upsert({
      where: { code: "AE" },
      update: {},
      create: { name: "UAE", code: "AE", flag: "🇦🇪", description: "News from the UAE" },
    }),
  ]);

  console.log(`✅ Seeded ${origins.length} origins`);

  // ── Categories ──
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: { name: "Technology", slug: "technology", description: "Tech, AI, startups, gadgets", icon: "💻" },
    }),
    prisma.category.upsert({
      where: { slug: "politics" },
      update: {},
      create: { name: "Politics", slug: "politics", description: "Government, elections, policy", icon: "🏛️" },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "Sports", slug: "sports", description: "Football, cricket, basketball and more", icon: "⚽" },
    }),
    prisma.category.upsert({
      where: { slug: "business" },
      update: {},
      create: { name: "Business", slug: "business", description: "Markets, economy, finance", icon: "📈" },
    }),
    prisma.category.upsert({
      where: { slug: "entertainment" },
      update: {},
      create: { name: "Entertainment", slug: "entertainment", description: "Movies, music, pop culture", icon: "🎬" },
    }),
    prisma.category.upsert({
      where: { slug: "science" },
      update: {},
      create: { name: "Science", slug: "science", description: "Research, space, discoveries", icon: "🔬" },
    }),
    prisma.category.upsert({
      where: { slug: "health" },
      update: {},
      create: { name: "Health", slug: "health", description: "Medicine, wellness, healthcare", icon: "🏥" },
    }),
    prisma.category.upsert({
      where: { slug: "world" },
      update: {},
      create: { name: "World", slug: "world", description: "International news and affairs", icon: "🌍" },
    }),
  ]);

  console.log(`✅ Seeded ${categories.length} categories`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
