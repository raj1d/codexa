import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const semesters = await prisma.semester.count();
  const subjects = await prisma.subject.count();
  const units = await prisma.unit.count();
  const resources = await prisma.resource.count();
  const problems = await prisma.problem.count();
  const testCases = await prisma.testCase.count();
  const projects = await prisma.project.count();
  const badges = await prisma.badge.count();

  console.log("=== NEON DATABASE CURRENT STATE ===");
  console.log(`- Semesters: ${semesters}`);
  console.log(`- Subjects: ${subjects}`);
  console.log(`- Units: ${units}`);
  console.log(`- Resources (Notes/PPTs/PYQs): ${resources}`);
  console.log(`- DSA Problems: ${problems}`);
  console.log(`- Test Cases: ${testCases}`);
  console.log(`- Projects: ${projects}`);
  console.log(`- Badges: ${badges}`);
  console.log("====================================");
}

main().finally(async () => {
  await prisma.$disconnect();
});
