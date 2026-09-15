import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { MeilisearchService, RESOURCES_INDEX } from "../common/meilisearch.service";
import { StorageService } from "../common/storage.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { FilterResourceDto } from "./dto/filter-resource.dto";
import { ResourceStatus, Prisma } from "@prisma/client";

@Injectable()
export class StudyHubService {
  private readonly logger = new Logger(StudyHubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly meilisearch: MeilisearchService,
    private readonly storage: StorageService,
  ) {}

  async getSemesters() {
    return this.prisma.semester.findMany({
      orderBy: { number: "asc" },
      include: {
        _count: {
          select: { subjects: true },
        },
      },
    });
  }

  async getSubjects(semesterId?: string) {
    const where: Prisma.SubjectWhereInput = semesterId
      ? { semesterId }
      : {};

    return this.prisma.subject.findMany({
      where,
      orderBy: { code: "asc" },
      include: {
        semester: true,
        units: {
          orderBy: { number: "asc" },
          include: {
            _count: {
              select: {
                resources: {
                  where: { status: ResourceStatus.APPROVED },
                },
              },
            },
          },
        },
        _count: {
          select: { units: true },
        },
      },
    });
  }

  async getSubjectById(subjectId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        semester: true,
        units: {
          orderBy: { number: "asc" },
          include: {
            _count: {
              select: {
                resources: {
                  where: { status: ResourceStatus.APPROVED },
                },
              },
            },
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }

    return subject;
  }

  async getUnits(subjectId: string) {
    return this.prisma.unit.findMany({
      where: { subjectId },
      orderBy: { number: "asc" },
      include: {
        _count: {
          select: {
            resources: {
              where: { status: ResourceStatus.APPROVED },
            },
          },
        },
      },
    });
  }

  async getResources(filter: FilterResourceDto) {
    // If a search query is provided, use Meilisearch for typo-tolerant search
    if (filter.query && filter.query.trim().length > 0) {
      try {
        const filters: string[] = ["status = 'APPROVED'"];
        if (filter.semesterId) filters.push(`semesterId = '${filter.semesterId}'`);
        if (filter.subjectId) filters.push(`subjectId = '${filter.subjectId}'`);
        if (filter.unitId) filters.push(`unitId = '${filter.unitId}'`);
        if (filter.fileType) filters.push(`fileType = '${filter.fileType}'`);

        const searchResult = await this.meilisearch.search(filter.query, {
          filter: filters.join(" AND "),
          limit: 50,
        });

        if (searchResult.hits.length > 0) {
          const ids = searchResult.hits.map((h: any) => h.id);
          const resources = await this.prisma.resource.findMany({
            where: { id: { in: ids } },
            include: {
              unit: {
                include: {
                  subject: {
                    include: { semester: true },
                  },
                },
              },
              uploader: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                  githubUsername: true,
                },
              },
            },
          });

          // Sort in the order returned by Meilisearch relevance
          return ids
            .map((id) => resources.find((r) => r.id === id))
            .filter(Boolean);
        }
      } catch (err: any) {
        this.logger.warn(`Meilisearch query failed, falling back to DB: ${err.message}`);
      }
    }

    // Standard relational query with filters
    const where: Prisma.ResourceWhereInput = {
      status: filter.status || ResourceStatus.APPROVED,
    };

    if (filter.semesterId) where.semesterId = filter.semesterId;
    if (filter.subjectId) where.subjectId = filter.subjectId;
    if (filter.unitId) where.unitId = filter.unitId;
    if (filter.fileType) where.fileType = filter.fileType;
    if (filter.query) {
      where.OR = [
        { title: { contains: filter.query, mode: "insensitive" } },
        { description: { contains: filter.query, mode: "insensitive" } },
      ];
    }

    return this.prisma.resource.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        unit: {
          include: {
            subject: {
              include: { semester: true },
            },
          },
        },
        uploader: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            githubUsername: true,
          },
        },
      },
    });
  }

  async getResourceById(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            subject: {
              include: { semester: true },
            },
          },
        },
        uploader: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            githubUsername: true,
          },
        },
      },
    });

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    return resource;
  }

  async getDownloadUrl(id: string) {
    const resource = await this.getResourceById(id);

    if (resource.fileUrl.startsWith("http://") || resource.fileUrl.startsWith("https://")) {
      return {
        url: resource.fileUrl,
        title: resource.title,
        fileType: resource.fileType,
      };
    }

    const presignedUrl = await this.storage.getPresignedDownloadUrl(resource.fileUrl);
    return {
      url: presignedUrl,
      title: resource.title,
      fileType: resource.fileType,
    };
  }

  async createResource(uploaderId: string, dto: CreateResourceDto) {
    // Validate unit exists
    const unit = await this.prisma.unit.findUnique({
      where: { id: dto.unitId },
      include: { subject: true },
    });

    if (!unit) {
      throw new BadRequestException("Invalid unitId specified");
    }

    const resource = await this.prisma.resource.create({
      data: {
        title: dto.title,
        description: dto.description || null,
        fileType: dto.fileType,
        fileUrl: dto.fileUrl,
        semesterId: dto.semesterId,
        subjectId: dto.subjectId,
        unitId: dto.unitId,
        uploaderId,
        status: ResourceStatus.PENDING,
      },
      include: {
        unit: {
          include: { subject: true },
        },
        uploader: {
          select: { id: true, name: true },
        },
      },
    });

    return resource;
  }

  async updateStatus(id: string, status: ResourceStatus) {
    const resource = await this.prisma.resource.update({
      where: { id },
      data: { status },
      include: {
        unit: { include: { subject: true } },
      },
    });

    // If approved, push to Meilisearch index
    if (status === ResourceStatus.APPROVED) {
      try {
        await this.meilisearch.addDocuments([
          {
            id: resource.id,
            title: resource.title,
            description: resource.description,
            fileType: resource.fileType,
            fileUrl: resource.fileUrl,
            semesterId: resource.semesterId,
            subjectId: resource.subjectId,
            unitId: resource.unitId,
            uploaderId: resource.uploaderId,
            status: resource.status,
            createdAt: resource.createdAt.toISOString(),
          },
        ]);
        this.logger.log(`Indexed approved resource in Meilisearch: ${resource.id}`);
      } catch (err: any) {
        this.logger.warn(`Failed to index resource in Meilisearch: ${err.message}`);
      }
    } else {
      // If rejected, remove from search index
      try {
        await this.meilisearch.deleteDocument(resource.id);
      } catch (err: any) {
        this.logger.warn(`Failed to delete document from Meilisearch: ${err.message}`);
      }
    }

    return resource;
  }

  async getPendingResources() {
    return this.prisma.resource.findMany({
      where: { status: ResourceStatus.PENDING },
      orderBy: { createdAt: "desc" },
      include: {
        unit: {
          include: {
            subject: {
              include: { semester: true },
            },
          },
        },
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
            githubUsername: true,
          },
        },
      },
    });
  }

  getStatus() {
    return {
      module: "study-hub",
      status: "operational",
      features: ["browse-curriculum", "meilisearch-search", "r2-storage", "moderation"],
    };
  }
}
