import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreateProjectDto, FilterProjectDto, RateProjectDto } from "./dto/create-project.dto";
import { Prisma, ResourceStatus } from "@prisma/client";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjects(filter: FilterProjectDto) {
    const where: Prisma.ProjectWhereInput = {
      status: ResourceStatus.APPROVED,
    };

    if (filter.tag && filter.tag !== "ALL") {
      where.tags = { has: filter.tag };
    }

    if (filter.query) {
      where.OR = [
        { title: { contains: filter.query, mode: "insensitive" } },
        { description: { contains: filter.query, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      filter.sort === "stars"
        ? { starsCount: "desc" }
        : filter.sort === "newest"
          ? { createdAt: "desc" }
          : { avgRating: "desc" };

    return this.prisma.project.findMany({
      where,
      orderBy,
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            githubUsername: true,
          },
        },
        _count: {
          select: {
            ratings: true,
            bookmarks: true,
          },
        },
      },
    });
  }

  async getProjectBySlug(slug: string, userId?: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            githubUsername: true,
          },
        },
        ratings: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true, githubUsername: true },
            },
          },
        },
        _count: {
          select: {
            ratings: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project '${slug}' not found`);
    }

    let isBookmarked = false;
    let userRating: number | null = null;

    if (userId) {
      const bookmark = await this.prisma.projectBookmark.findUnique({
        where: {
          userId_projectId: { userId, projectId: project.id },
        },
      });
      isBookmarked = !!bookmark;

      const rating = await this.prisma.projectRating.findUnique({
        where: {
          userId_projectId: { userId, projectId: project.id },
        },
      });
      if (rating) userRating = rating.score;
    }

    return {
      ...project,
      isBookmarked,
      userRating,
    };
  }

  async createProject(userId: string, dto: CreateProjectDto) {
    const baseSlug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug;
    let count = 1;
    while (await this.prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    return this.prisma.project.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        repoUrl: dto.repoUrl,
        demoUrl: dto.demoUrl || null,
        docsUrl: dto.docsUrl || null,
        tags: dto.tags,
        submitterId: userId,
        status: ResourceStatus.APPROVED,
      },
      include: {
        submitter: {
          select: { id: true, name: true, githubUsername: true },
        },
      },
    });
  }

  async rateProject(userId: string, projectId: string, dto: RateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    // Upsert rating
    await this.prisma.projectRating.upsert({
      where: {
        userId_projectId: { userId, projectId },
      },
      update: {
        score: dto.score,
        feedback: dto.feedback || null,
      },
      create: {
        userId,
        projectId,
        score: dto.score,
        feedback: dto.feedback || null,
      },
    });

    // Recalculate average rating
    const allRatings = await this.prisma.projectRating.findMany({
      where: { projectId },
      select: { score: true },
    });

    const sum = allRatings.reduce((acc, r) => acc + r.score, 0);
    const avgRating = Number((sum / allRatings.length).toFixed(1));

    await this.prisma.project.update({
      where: { id: projectId },
      data: { avgRating },
    });

    return { projectId, avgRating, totalRatings: allRatings.length, userScore: dto.score };
  }

  async toggleBookmark(userId: string, projectId: string) {
    const existing = await this.prisma.projectBookmark.findUnique({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    if (existing) {
      await this.prisma.projectBookmark.delete({
        where: { id: existing.id },
      });
      return { projectId, bookmarked: false };
    }

    await this.prisma.projectBookmark.create({
      data: { userId, projectId },
    });

    return { projectId, bookmarked: true };
  }

  async getUserBookmarks(userId: string) {
    const bookmarks = await this.prisma.projectBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          include: {
            submitter: {
              select: { id: true, name: true, githubUsername: true },
            },
          },
        },
      },
    });

    return bookmarks.map((b) => b.project);
  }

  async getTags() {
    const projects = await this.prisma.project.findMany({
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    for (const p of projects) {
      for (const t of p.tags) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }

    return Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  getStatus() {
    return {
      module: "projects",
      status: "operational",
      features: ["project-showcases", "ratings", "bookmarks", "github-links"],
    };
  }
}
