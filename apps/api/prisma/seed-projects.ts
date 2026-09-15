import { PrismaClient, ResourceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Open-Source Projects...");

  // Fetch or create a demo student/contributor
  let user = await prisma.user.findFirst({
    where: { email: "contributor@codexa.dev" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "contributor@codexa.dev",
        name: "Aarav Sharma",
        role: "CONTRIBUTOR",
        githubUsername: "aaravsharma-dev",
      },
    });
  }

  const projectsData = [
    {
      title: "GTU Grade Calculator & Syllabus Tracker",
      slug: "gtu-grade-calculator",
      description:
        "A lightweight, responsive web application for GTU engineering students to calculate SPI, CPI, and CGPA based on exact university grading formulas. Includes downloadable grade prediction sheets.",
      repoUrl: "https://github.com/codexa-hub/gtu-grade-calculator",
      demoUrl: "https://gtu-calculator.codexa.dev",
      docsUrl: "https://github.com/codexa-hub/gtu-grade-calculator/blob/main/README.md",
      tags: ["Web Dev", "React", "TypeScript", "Tailwind CSS"],
      submitterId: user.id,
      status: ResourceStatus.APPROVED,
      starsCount: 142,
      avgRating: 4.9,
    },
    {
      title: "CampusSync — Event & Club Management Portal",
      slug: "campus-sync-portal",
      description:
        "Fullstack college event management platform allowing student committees to host tech fests, handle team registrations, issue QR-code event passes, and manage lost-and-found items.",
      repoUrl: "https://github.com/codexa-hub/campus-sync",
      demoUrl: "https://campussync.codexa.dev",
      docsUrl: "https://github.com/codexa-hub/campus-sync/blob/main/docs/architecture.md",
      tags: ["Web Dev", "Next.js", "NestJS", "PostgreSQL", "Tailwind CSS"],
      submitterId: user.id,
      status: ResourceStatus.APPROVED,
      starsCount: 98,
      avgRating: 4.8,
    },
    {
      title: "Brain Tumor Segmentation using U-Net & PyTorch",
      slug: "brain-tumor-segmentation-unet",
      description:
        "Deep learning biomedical computer vision pipeline using an attention U-Net architecture to segment brain MRI scans. Trained on BraTS benchmark dataset with 0.89 Dice coefficient.",
      repoUrl: "https://github.com/codexa-hub/brain-tumor-segmentation",
      demoUrl: "https://huggingface.co/spaces/codexa/brain-tumor-unet",
      docsUrl: "https://github.com/codexa-hub/brain-tumor-segmentation/blob/main/README.md",
      tags: ["AI/ML", "Python", "PyTorch", "Computer Vision", "Deep Learning"],
      submitterId: user.id,
      status: ResourceStatus.APPROVED,
      starsCount: 215,
      avgRating: 5.0,
    },
    {
      title: "PacketGuard — Network Packet Sniffer & Firewall",
      slug: "packetguard-sniffer",
      description:
        "Raw socket network packet analyzer written in Python with PCAP export, real-time ARP spoofing detection, and port scan alerts. Designed for Computer Networks and Cyber Security lab courses.",
      repoUrl: "https://github.com/codexa-hub/packetguard",
      docsUrl: "https://github.com/codexa-hub/packetguard/blob/main/README.md",
      tags: ["Cyber Security", "Python", "Networking", "Socket Programming"],
      submitterId: user.id,
      status: ResourceStatus.APPROVED,
      starsCount: 87,
      avgRating: 4.7,
    },
    {
      title: "RaftKV — Distributed Fault-Tolerant Key-Value Store",
      slug: "raft-kv-store",
      description:
        "High-performance distributed key-value database implementing the Raft consensus algorithm in Go. Features leader election, log replication, snapshotting, and linearizable reads.",
      repoUrl: "https://github.com/codexa-hub/raft-kv",
      docsUrl: "https://github.com/codexa-hub/raft-kv/blob/main/docs/raft-spec.md",
      tags: ["Cloud", "Go", "Distributed Systems", "Database"],
      submitterId: user.id,
      status: ResourceStatus.APPROVED,
      starsCount: 178,
      avgRating: 4.9,
    },
  ];

  for (const p of projectsData) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  console.log("Open-Source Projects seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
