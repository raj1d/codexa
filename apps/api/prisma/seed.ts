import { PrismaClient, FileType, ResourceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding GTU IT/CSE Curriculum...");

  // Create demo admin / contributor user if not exists
  const contributor = await prisma.user.upsert({
    where: { email: "contributor@codexa.dev" },
    update: {},
    create: {
      email: "contributor@codexa.dev",
      name: "CODEXA Open Contributor",
      role: "CONTRIBUTOR",
      githubUsername: "codexa-contributor",
    },
  });

  // Semesters 1 to 8
  const semestersData = [
    { number: 1, name: "Semester 1 — Foundation" },
    { number: 2, name: "Semester 2 — Core Basics" },
    { number: 3, name: "Semester 3 — Core CS Fundamentals" },
    { number: 4, name: "Semester 4 — Systems & Programming" },
    { number: 5, name: "Semester 5 — Algorithms & Networks" },
    { number: 6, name: "Semester 6 — Web & Software Engineering" },
    { number: 7, name: "Semester 7 — Advanced AI & Cloud" },
    { number: 8, name: "Semester 8 — Capstone & Specialization" },
  ];

  const semesterMap: Record<number, string> = {};

  for (const sem of semestersData) {
    const record = await prisma.semester.upsert({
      where: { number: sem.number },
      update: { name: sem.name },
      create: sem,
    });
    semesterMap[sem.number] = record.id;
  }

  // Key Subjects
  const subjectsData = [
    // Sem 3
    {
      code: "3130702",
      name: "Data Structures",
      semesterId: semesterMap[3],
      units: [
        { number: 1, name: "Introduction to Data Structures & Arrays" },
        { number: 2, name: "Linear Data Structures: Stacks and Queues" },
        { number: 3, name: "Linked Lists: Singly, Doubly, Circular" },
        { number: 4, name: "Non-Linear Data Structures: Trees & Binary Search Trees" },
        { number: 5, name: "Graphs: Representations, Traversals & Shortest Paths" },
      ],
    },
    {
      code: "3130703",
      name: "Database Management Systems",
      semesterId: semesterMap[3],
      units: [
        { number: 1, name: "Database Architecture & ER Modeling" },
        { number: 2, name: "Relational Algebra & SQL Query Optimization" },
        { number: 3, name: "Normalization (1NF to BCNF, 4NF)" },
        { number: 4, name: "Transaction Processing, ACID Properties & Concurrency" },
        { number: 5, name: "Indexing, Hashing & Storage Architecture" },
      ],
    },
    // Sem 4
    {
      code: "3140702",
      name: "Operating Systems",
      semesterId: semesterMap[4],
      units: [
        { number: 1, name: "OS Structure, Services & System Calls" },
        { number: 2, name: "Process Management, Threads & CPU Scheduling" },
        { number: 3, name: "Process Synchronization & Deadlocks" },
        { number: 4, name: "Memory Management: Paging & Virtual Memory" },
        { number: 5, name: "Storage Management & File Systems" },
      ],
    },
    {
      code: "3140705",
      name: "Object Oriented Programming with Java",
      semesterId: semesterMap[4],
      units: [
        { number: 1, name: "OOP Principles, Classes, Objects & Methods" },
        { number: 2, name: "Inheritance, Interfaces & Polymorphism" },
        { number: 3, name: "Exception Handling & Multithreading" },
        { number: 4, name: "Java Collections Framework & Generics" },
        { number: 5, name: "I/O Streams & Modern Java Features" },
      ],
    },
    // Sem 5
    {
      code: "3150703",
      name: "Analysis and Design of Algorithms",
      semesterId: semesterMap[5],
      units: [
        { number: 1, name: "Algorithm Analysis & Asymptotic Notations" },
        { number: 2, name: "Divide and Conquer Approach" },
        { number: 3, name: "Dynamic Programming & Memoization" },
        { number: 4, name: "Greedy Algorithms & Graph Algorithms" },
        { number: 5, name: "NP-Completeness, Backtracking & Branch and Bound" },
      ],
    },
    {
      code: "3150710",
      name: "Computer Networks",
      semesterId: semesterMap[5],
      units: [
        { number: 1, name: "OSI and TCP/IP Reference Models" },
        { number: 2, name: "Data Link Layer & Error Control" },
        { number: 3, name: "Network Layer & Routing Protocols" },
        { number: 4, name: "Transport Layer: TCP, UDP & Congestion Control" },
        { number: 5, name: "Application Layer Protocols (HTTP, DNS, TLS)" },
      ],
    },
  ];

  for (const sub of subjectsData) {
    const subjectRecord = await prisma.subject.upsert({
      where: { code: sub.code },
      update: { name: sub.name, semesterId: sub.semesterId },
      create: {
        code: sub.code,
        name: sub.name,
        semesterId: sub.semesterId,
      },
    });

    for (const u of sub.units) {
      const unitRecord = await prisma.unit.upsert({
        where: {
          subjectId_number: {
            subjectId: subjectRecord.id,
            number: u.number,
          },
        },
        update: { name: u.name },
        create: {
          subjectId: subjectRecord.id,
          number: u.number,
          name: u.name,
        },
      });

      // Add sample resources for Unit 1 & 2
      if (u.number === 1) {
        await prisma.resource.createMany({
          data: [
            {
              title: `${sub.name} — Comprehensive Unit 1 Lecture Notes`,
              description: `Handwritten & digitized lecture notes covering foundational concepts for ${sub.name} Unit 1.`,
              fileType: FileType.NOTES,
              fileUrl: "https://raw.githubusercontent.com/codexa-hub/assets/main/samples/notes-sample.pdf",
              semesterId: sub.semesterId,
              subjectId: subjectRecord.id,
              unitId: unitRecord.id,
              uploaderId: contributor.id,
              status: ResourceStatus.APPROVED,
            },
            {
              title: `${sub.name} — GTU Previous Year Questions (2021-2025 Solved)`,
              description: `Solved previous university exam papers for ${sub.name}.`,
              fileType: FileType.PYQ,
              fileUrl: "https://raw.githubusercontent.com/codexa-hub/assets/main/samples/pyq-sample.pdf",
              semesterId: sub.semesterId,
              subjectId: subjectRecord.id,
              unitId: unitRecord.id,
              uploaderId: contributor.id,
              status: ResourceStatus.APPROVED,
            },
          ],
          skipDuplicates: true,
        });
      }
    }
  }

  console.log("Seeding complete! Semesters, Subjects, Units and Sample Resources created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
