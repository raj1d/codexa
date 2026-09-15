# CODEXA — Open-Source Education Hub for IT/CSE Students

> **Curriculum, Coding & AI. Connected in one terminal.**

CODEXA is an open-source, community-driven education platform built specifically for IT and Computer Engineering students (aligned with GTU & Indian university curricula). It replaces fragmented WhatsApp groups, random question paper archives, and disconnected tools with one unified, cinematic academic ecosystem.

---

## 🏛️ Platform Architecture

```
CODEXA/
├── apps/
│   ├── web/              # Next.js 15 App Router Frontend (React 19, Tailwind, Framer Motion)
│   ├── api/              # NestJS 12 Core Backend API (TypeScript, Prisma, Swagger)
│   └── ai-service/       # FastAPI Python Microservice (RAG, Syllabus Chunking)
├── packages/
│   └── shared/           # Shared TypeScript types, enums & constants
├── docker/               # Local Docker configuration & init scripts
├── scripts/              # Infrastructure connection validation utilities
└── .github/workflows/    # CI/CD automated test & build workflows
```

---

## 🌟 Core Modules

### 1. Centralized Study Hub (`/study-hub`)
- **Semester &rarr; Subject &rarr; Unit Taxonomy:** Curated GTU curriculum structure covering Semesters 1 to 8.
- **Multi-Format Support:** Handwritten & digitized lecture notes, solved previous year question papers (PYQs), and practical lab manuals.
- **Typo-Tolerant Search:** Powered by **Meilisearch Cloud** with instant filtering.
- **Zero-Egress Storage:** Scalable PDF distribution using **Cloudflare R2** object storage.
- **Community Moderation Queue (`/admin/moderation`):** Review and approve contributor submissions before public indexing.

### 2. In-Browser DSA Practice (`/practice`)
- **Monaco Code Editor:** Integrated developer editor with dark CRT theme, JetBrains Mono font, and phosphor cursor.
- **Sandboxed Execution Engine:** Multi-language test runner (Python, JavaScript, C++) with memory and execution timeouts.
- **Hidden & Public Test Cases:** Instant terminal verdicts (`[PASS]`, `[FAIL]`, `[TIMEOUT]`, `[COMPILATION_ERROR]`).
- **Topic Tracks:** Arrays, Stacks, Trees (BFS/DFS), Dynamic Programming, Graphs, and DBMS SQL.

### 3. Grounded AI Study Assistant (`/ai-assistant`)
- **Syllabus-Grounded RAG:** Retrieval-augmented generation powered by pgvector vector search over verified notes.
- **Live Source Citations:** Every answer cites the exact document title, unit number, and quote linking back to Study Hub notes.
- **Beginner Mode:** Simplifies complex computer engineering jargon with real-world analogies.
- **Viva / Exam Mode:** Generates rapid 7-mark university exam answers with likely examiner follow-up questions.
- **Note Summarizer & Quiz Predictor:** Paste raw notes to extract key takeaways and predicted exam questions.

### 4. Open-Source Project Hub (`/projects`)
- **Student Capstone Showcase:** Publish engineering repositories with GitHub links, live demos, and documentation.
- **Domain Categories:** Web Dev, AI/ML, Cyber Security, Cloud & Distributed Systems, Python, React, Go.
- **Community Reviews & Ratings:** 5-star rating system and bookmarking.

### 5. Gamification & Leaderboard (`/leaderboard`)
- **Redis Sorted-Set Leaderboard:** Real-time ranking calculated from DSA solves, active study streaks, and note contributions.
- **Daily Streak Tracker:** Consecutive study day rewards with retro LED status.
- **Unlockable Badges:** First Blood, Weekly Scholar, Open Contributor, and Algorithm Master.
- **Upcoming Exam Deadlines:** Personal exam and assignment deadline tracker.

### 6. Student Dashboard (`/dashboard`)
- **Progress Tracking:** 4px phosphor progress meters tracking unit completion across every semester subject.
- **Recent Activity Feed:** Real-time log of completed topics and practice milestones.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js 22 LTS+**
- **pnpm 9+** (`npm install -g pnpm`)
- **Git**

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/codexa-hub/codexa.git
cd CODEXA

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Validate cloud database & cache connections
pnpm validate

# Seed GTU curriculum, DSA problems, projects, and badges
pnpm --filter @codexa/api run db:seed
```

### 3. Run Development Servers
```bash
# Frontend (Next.js 15) -> http://localhost:3000
pnpm dev

# Backend API (NestJS 12) -> http://localhost:4000
pnpm dev:api
```

- **Interactive Swagger Docs:** http://localhost:4000/api/docs

---

## 🔒 Security & Privacy
- **Unauthenticated Free Access:** Students can browse, read, and download all study materials without creating an account.
- **Authentication:** GitHub OAuth (first-class) and Email/Password with bcrypt hashing.
- **JWT Protection:** State-isolated JWT authentication guards on uploads, submissions, ratings, and dashboard APIs.

---

## 📄 License
Licensed under the [MIT License](LICENSE). Built by and for engineering students.
