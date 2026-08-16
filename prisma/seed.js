/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Running initial database seed...");

  // 1. Site Settings
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {
      websiteName: "Team SCAI",
      orgName: "Student Community for AI & Innovation",
    },
    create: {
      id: "default",
      websiteName: "Team SCAI",
      orgName: "Student Community for AI & Innovation",
      logoUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&auto=format&fit=crop&q=80",
      faviconUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=64&auto=format&fit=crop&q=80",
      contactEmail: "scailpu@gmail.com",
      contactPhone: null,
      instagramUrl: "https://instagram.com/teamscai",
      linkedinUrl: "https://linkedin.com/company/teamscai",
      githubUrl: "https://github.com/teamscai",
      twitterUrl: "https://twitter.com/teamscai",
      youtubeUrl: "https://youtube.com/@teamscai",
      address: null,
      aboutShort: "Empowering next-generation innovators through high-impact hackathons, AI workshops, and collaborative tech events.",
      aboutFull: "Team SCAI is a premier student organization dedicated to fostering practical excellence in Artificial Intelligence, Software Engineering, Design, and Creative Computing. We organize flagship collegiate events, technical symposiums, research circles, and community outreach programs.",
      footerText: "© 2026 Team SCAI. Built for excellence in collegiate innovation.",
    },
  });

  // 2. Initial Super Admin Account (from env or secure setup)
  const initialAdminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@teamscai.com";
  const initialAdminPassword = process.env.ADMIN_INITIAL_PASSWORD || "ChangeMePromptly@2026!";
  const adminPasswordHash = await bcrypt.hash(initialAdminPassword, 10);

  // Check if EVT-0001 exists
  const existingAdmin = await prisma.user.findUnique({
    where: { accountId: "EVT-0001" },
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { accountId: "EVT-0001" },
      data: {
        email: initialAdminEmail,
        name: "Team SCAI Super Admin",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
  } else {
    await prisma.user.create({
      data: {
        accountId: "EVT-0001",
        email: initialAdminEmail,
        name: "Team SCAI Super Admin",
        passwordHash: adminPasswordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
  }

  console.log("✅ Database initialized successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
