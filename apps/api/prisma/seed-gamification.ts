import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Gamification Badges & Leaderboard...");

  const badges = [
    {
      name: "First Blood",
      slug: "first-solve",
      description: "Solved your first in-browser DSA practice problem.",
      icon: "Code2",
      points: 50,
    },
    {
      name: "Weekly Scholar",
      slug: "7-day-streak",
      description: "Maintained a 7-day continuous study & practice streak.",
      icon: "Flame",
      points: 100,
    },
    {
      name: "Open Contributor",
      slug: "first-upload",
      description: "Contributed approved syllabus notes to the Study Hub.",
      icon: "Upload",
      points: 150,
    },
    {
      name: "Algorithm Master",
      slug: "algorithm-master",
      description: "Successfully solved 5+ intermediate or advanced DSA problems.",
      icon: "Award",
      points: 200,
    },
    {
      name: "Capstone Builder",
      slug: "repo-submit",
      description: "Published a verified open-source student repository to the hub.",
      icon: "FolderGit2",
      points: 250,
    },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }

  // Create demo leaderboard users
  const demoUsers = [
    {
      name: "Dev Patel",
      email: "dev.patel@gtu.edu",
      githubUsername: "devpatel-cs",
      streakDays: 14,
      solves: 18,
      uploads: 4,
    },
    {
      name: "Pooja Mehta",
      email: "pooja.mehta@gtu.edu",
      githubUsername: "poojamehta",
      streakDays: 9,
      solves: 14,
      uploads: 2,
    },
    {
      name: "Karan Desai",
      email: "karan.desai@gtu.edu",
      githubUsername: "karandesai",
      streakDays: 7,
      solves: 11,
      uploads: 5,
    },
    {
      name: "Riya Shah",
      email: "riya.shah@gtu.edu",
      githubUsername: "riyashah-dev",
      streakDays: 5,
      solves: 9,
      uploads: 1,
    },
  ];

  const firstSolveBadge = await prisma.badge.findUnique({ where: { slug: "first-solve" } });
  const streakBadge = await prisma.badge.findUnique({ where: { slug: "7-day-streak" } });

  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, githubUsername: u.githubUsername },
      create: {
        email: u.email,
        name: u.name,
        githubUsername: u.githubUsername,
        role: "STUDENT",
      },
    });

    // Create streak
    await prisma.streak.upsert({
      where: { userId: user.id },
      update: { currentStreak: u.streakDays, longestStreak: u.streakDays },
      create: {
        userId: user.id,
        currentStreak: u.streakDays,
        longestStreak: u.streakDays,
      },
    });

    // Award badges
    if (firstSolveBadge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: user.id, badgeId: firstSolveBadge.id } },
        update: {},
        create: { userId: user.id, badgeId: firstSolveBadge.id },
      });
    }

    if (u.streakDays >= 7 && streakBadge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: user.id, badgeId: streakBadge.id } },
        update: {},
        create: { userId: user.id, badgeId: streakBadge.id },
      });
    }

    // Create a sample upcoming deadline
    await prisma.deadline.create({
      data: {
        userId: user.id,
        title: "DBMS Mid-Sem Exam: Normalization & SQL Queries",
        dueDate: new Date(Date.now() + 5 * 86400000), // 5 days from now
        subjectCode: "3130703",
      },
    });
  }

  console.log("Gamification Badges, Streaks & Deadlines seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
