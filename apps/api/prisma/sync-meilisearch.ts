import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MEILI_URL = process.env.MEILI_URL || "https://ms-6d1308dd368c-54227.sgp.meilisearch.io";
const MEILI_KEY = process.env.MEILI_MASTER_KEY || "f8838e985c1338a16f45368ff27aafdd7da05ef7a349f6c311546b18ccd4eeb6";

async function main() {
  console.log("Syncing all Darshan Uni & GTURanker study materials to Meilisearch Cloud...");

  const resources = await prisma.resource.findMany({
    where: { status: "APPROVED" },
    include: {
      unit: {
        include: {
          subject: true,
        },
      },
    },
  });

  console.log(`Preparing ${resources.length} documents for indexing.`);

  const documents = resources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    fileType: r.fileType,
    fileUrl: r.fileUrl,
    semesterId: r.semesterId,
    subjectId: r.subjectId,
    subjectName: r.unit.subject.name,
    subjectCode: r.unit.subject.code,
    unitId: r.unitId,
    unitNumber: r.unit.number,
    uploaderId: r.uploaderId,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  try {
    const res = await fetch(`${MEILI_URL}/indexes/resources/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MEILI_KEY}`,
      },
      body: JSON.stringify(documents),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Meilisearch indexing task queued:", data);
    } else {
      console.error("Meilisearch response:", res.status, await res.text());
    }
  } catch (err: any) {
    console.error("Failed to sync to Meilisearch:", err.message);
  }

  console.log("Meilisearch sync complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
