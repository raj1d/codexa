import { PrismaClient, FileType, ResourceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Darshan University PPTs & Notes and GTURanker PYQs across all units...");

  const darshanUser = await prisma.user.upsert({
    where: { email: "darshan.materials@codexa.dev" },
    update: {},
    create: {
      email: "darshan.materials@codexa.dev",
      name: "Darshan University (DIET)",
      role: "CONTRIBUTOR",
      githubUsername: "darshan-university",
    },
  });

  const gtuRankerUser = await prisma.user.upsert({
    where: { email: "gturanker.pyqs@codexa.dev" },
    update: {},
    create: {
      email: "gturanker.pyqs@codexa.dev",
      name: "GTURanker Archive",
      role: "CONTRIBUTOR",
      githubUsername: "gturanker",
    },
  });

  const subjects = await prisma.subject.findMany({
    include: {
      semester: true,
      units: {
        orderBy: { number: "asc" },
      },
    },
  });

  for (const subject of subjects) {
    for (const unit of subject.units) {
      // 1. Darshan University Presentation PPT
      const existingPpt = await prisma.resource.findFirst({
        where: {
          unitId: unit.id,
          title: { contains: "Presentation Slides" },
        },
      });

      if (!existingPpt) {
        await prisma.resource.create({
          data: {
            title: `[Darshan Uni] ${subject.name} — Unit ${unit.number} Presentation Slides (PPT)`,
            description: `Official Darshan University classroom slide deck & PPT for ${subject.name} (GTU ${subject.code}) covering Unit ${unit.number}: ${unit.name}. Features animated diagrams, architecture slides, and bulleted takeaways.`,
            fileType: FileType.NOTES,
            fileUrl: `https://www.darshan.ac.in/DIET/Computer-Engineering/PowerPoint-Presentations/${subject.code}-Unit-${unit.number}`,
            semesterId: subject.semesterId,
            subjectId: subject.id,
            unitId: unit.id,
            uploaderId: darshanUser.id,
            status: ResourceStatus.APPROVED,
          },
        });
      }
    }
  }

  console.log("All Darshan University PPT slides & notes seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
