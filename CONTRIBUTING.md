# Contributing to CODEXA

Welcome to **CODEXA** — the Open-Source Education Hub for IT & Computer Engineering students. We are thrilled you want to contribute!

---

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for everyone, regardless of background or experience level. Be respectful and constructive in issues and pull requests.

---

## Local Development Setup

### 1. Prerequisites
- **Node.js 22 LTS+**
- **pnpm 9+** (`npm install -g pnpm`)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/codexa-hub/codexa.git
cd CODEXA
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Environment Variables
Copy `.env.example` to `.env` and fill in your connection strings:
```bash
cp .env.example .env
```

You can either:
- Use free cloud tiers for development (**Neon Postgres**, **Upstash Redis**, **Meilisearch Cloud**).
- Or run local Docker containers: `docker compose up -d`

### 5. Validate Connections & Seed Database
```bash
pnpm validate
pnpm --filter @codexa/api run db:seed
```

### 6. Start Development Servers
In separate terminals:
```bash
# Frontend (Next.js 15) -> http://localhost:3000
pnpm dev

# Backend API (NestJS 12) -> http://localhost:4000
pnpm dev:api
```

---

## How to Contribute

### 1. Contributing Study Materials (Notes, PYQs, Lab Manuals)
- You can submit notes directly through the web UI at `/study-hub/upload`.
- Material should follow GTU syllabus unit mappings.
- Submissions will be reviewed in the moderation queue before public indexing.

### 2. Contributing DSA Practice Problems
- Add problems in `apps/api/prisma/seed-dsa.ts` with problem description, solution templates (Python, C++, Java, JS), and public + hidden test cases.
- Run `pnpm --filter @codexa/api run typecheck` to verify types.

### 3. Submitting Open-Source Student Projects
- Submit your GitHub repositories at `/projects/submit`.
- Ensure your repository includes a valid `README.md` and open-source license.

### 4. Submitting Code PRs
1. Fork the repository and create a branch: `git checkout -b feature/my-feature`
2. Commit your changes with clear messages.
3. Verify all checks pass:
   ```bash
   pnpm -r typecheck
   pnpm -r build
   ```
4. Push your branch and open a Pull Request.

---

## License

CODEXA is licensed under the [MIT License](LICENSE).
