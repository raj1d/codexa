import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { PrismaService } from "./common/prisma.service";

@ApiTags("Search")
@Controller("search")
export class GlobalSearchController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "Universal global search across Study Hub, DSA, and Projects" })
  @ApiQuery({ name: "q", required: true, example: "data" })
  async globalSearch(@Query("q") q: string) {
    if (!q || q.trim().length === 0) {
      return { studyHub: [], dsaProblems: [], projects: [] };
    }

    const query = q.trim();
    const queryLower = query.toLowerCase();

    // Map common abbreviations
    const terms = [queryLower];
    if (queryLower === "dbms") terms.push("database", "sql");
    if (queryLower === "os") terms.push("operating");
    if (queryLower === "dsa") terms.push("data", "structure", "algorithm");

    const [resources, problems, projects] = await Promise.all([
      this.prisma.resource.findMany({
        where: {
          status: "APPROVED",
          OR: terms.flatMap((t) => [
            { title: { contains: t, mode: "insensitive" } },
            { description: { contains: t, mode: "insensitive" } },
            { unit: { subject: { name: { contains: t, mode: "insensitive" } } } },
          ]),
        },
        take: 6,
        include: {
          unit: {
            include: { subject: true },
          },
        },
      }),
      this.prisma.problem.findMany({
        where: {
          OR: terms.flatMap((t) => [
            { title: { contains: t, mode: "insensitive" } },
            { topic: { contains: t, mode: "insensitive" } },
            { description: { contains: t, mode: "insensitive" } },
          ]),
        },
        take: 6,
      }),
      this.prisma.project.findMany({
        where: {
          status: "APPROVED",
          OR: terms.flatMap((t) => [
            { title: { contains: t, mode: "insensitive" } },
            { description: { contains: t, mode: "insensitive" } },
          ]),
        },
        take: 6,
      }),
    ]);

    return {
      studyHub: resources.map((r) => ({
        id: r.id,
        title: r.title,
        fileType: r.fileType,
        subjectName: r.unit.subject.name,
        unitNumber: r.unit.number,
        href: `/study-hub/resource/${r.id}`,
      })),
      dsaProblems: problems.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        topic: p.topic,
        href: `/practice/${p.slug}`,
      })),
      projects: projects.map((pr) => ({
        id: pr.id,
        slug: pr.slug,
        title: pr.title,
        tags: pr.tags,
        avgRating: pr.avgRating,
        href: `/projects/${pr.slug}`,
      })),
    };
  }
}
