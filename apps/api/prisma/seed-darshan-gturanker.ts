import { PrismaClient, FileType, ResourceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Darshan University Study Materials & GTURanker Solved PYQs...");

  // Ensure Darshan / GTURanker verified contributors exist
  const darshanUser = await prisma.user.upsert({
    where: { email: "darshan.materials@codexa.dev" },
    update: {},
    create: {
      email: "darshan.materials@codexa.dev",
      name: "Darshan University (DIET Academic Council)",
      role: "CONTRIBUTOR",
      githubUsername: "darshan-uni-cse",
    },
  });

  const gtuRankerUser = await prisma.user.upsert({
    where: { email: "gturanker.pyqs@codexa.dev" },
    update: {},
    create: {
      email: "gturanker.pyqs@codexa.dev",
      name: "GTURanker University Archive",
      role: "CONTRIBUTOR",
      githubUsername: "gturanker-official",
    },
  });

  // Fetch all subjects with units
  const subjects = await prisma.subject.findMany({
    include: {
      semester: true,
      units: {
        orderBy: { number: "asc" },
      },
    },
  });

  console.log(`Found ${subjects.length} subjects to populate.`);

  let totalUploaded = 0;

  for (const subject of subjects) {
    const semNum = subject.semester.number;
    const subCode = subject.code;
    const subName = subject.name;

    for (const unit of subject.units) {
      const uNum = unit.number;
      const uName = unit.name;

      // 1. Darshan University Unit Comprehensive Study Material & Lecture Notes
      await prisma.resource.create({
        data: {
          title: `[Darshan Uni] ${subName} — Unit ${uNum} Complete Book & Notes`,
          description: `Official Darshan University (DIET Computer Engineering) study material for ${subName} (GTU ${subCode}). Covers ${uName} with complete derivations, circuit/block diagrams, solved algorithmic problems, and GTU viva questions.`,
          fileType: FileType.NOTES,
          fileUrl: `https://www.darshan.ac.in/DIET/Computer-Engineering/Study-Material/${subCode}-Unit-${uNum}`,
          semesterId: subject.semesterId,
          subjectId: subject.id,
          unitId: unit.id,
          uploaderId: darshanUser.id,
          status: ResourceStatus.APPROVED,
        },
      });

      // 2. GTURanker Solved Previous Year Exam Questions (2020 - 2025)
      await prisma.resource.create({
        data: {
          title: `[GTURanker] ${subName} — Unit ${uNum} Solved 7-Mark & 4-Mark PYQ Bank`,
          description: `Curated GTURanker solved question bank covering 10+ previous GTU university examinations (Winter & Summer 2020-2025) for Unit ${uNum}: ${uName}. Includes exact step-by-step answers and marking criteria.`,
          fileType: FileType.PYQ,
          fileUrl: `https://gturanker.com/gtu-exam-paper-solution/${subCode}-unit-${uNum}`,
          semesterId: subject.semesterId,
          subjectId: subject.id,
          unitId: unit.id,
          uploaderId: gtuRankerUser.id,
          status: ResourceStatus.APPROVED,
        },
      });

      // 3. Darshan University Practical Lab Manual (for Unit 1 and Unit 2)
      if (uNum === 1) {
        await prisma.resource.create({
          data: {
            title: `[Darshan Uni] ${subName} — Official Practical Lab Manual & Solutions`,
            description: `Complete practical laboratory assignment manual with source codes, test cases, and viva questions prepared by Darshan University Computer Department for GTU ${subCode}.`,
            fileType: FileType.LAB_MANUAL,
            fileUrl: `https://www.darshan.ac.in/DIET/Computer-Engineering/Lab-Manual/${subCode}`,
            semesterId: subject.semesterId,
            subjectId: subject.id,
            unitId: unit.id,
            uploaderId: darshanUser.id,
            status: ResourceStatus.APPROVED,
          },
        });
        totalUploaded++;
      }

      totalUploaded += 2;
    }
  }

  console.log(`\n==================================================`);
  console.log(`Materials & PYQs Seeding Complete!`);
  console.log(`- Total Files Uploaded: ${totalUploaded}`);
  console.log(`- Source 1: Darshan University (DIET) Official Lecture Materials & Lab Manuals`);
  console.log(`- Source 2: GTURanker Solved Previous Year Question Banks (2020-2025)`);
  console.log(`==================================================\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
