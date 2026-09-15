import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ResourceStatus } from "@prisma/client";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string, semesterNumber: number = 3) {
    // Find target semester
    const semester = await this.prisma.semester.findUnique({
      where: { number: semesterNumber },
      include: {
        subjects: {
          include: {
            units: {
              include: {
                resources: {
                  where: { status: ResourceStatus.APPROVED },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!semester) {
      throw new NotFoundException(`Semester ${semesterNumber} not found`);
    }

    // Get user's completed resources
    const completedProgress = await this.prisma.userProgress.findMany({
      where: { userId },
      select: { resourceId: true, completedAt: true },
    });

    const completedSet = new Set(completedProgress.map((p) => p.resourceId));

    let totalSemesterResources = 0;
    let totalSemesterCompleted = 0;

    const subjectsSummary = semester.subjects.map((sub) => {
      let totalSubjectResources = 0;
      let totalSubjectCompleted = 0;

      const unitsSummary = sub.units.map((unit) => {
        const unitTotal = unit.resources.length;
        const unitCompleted = unit.resources.filter((r) =>
          completedSet.has(r.id),
        ).length;

        totalSubjectResources += unitTotal;
        totalSubjectCompleted += unitCompleted;

        return {
          id: unit.id,
          number: unit.number,
          name: unit.name,
          total: unitTotal,
          completed: unitCompleted,
          percentage:
            unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0,
        };
      });

      totalSemesterResources += totalSubjectResources;
      totalSemesterCompleted += totalSubjectCompleted;

      const subjectPercentage =
        totalSubjectResources > 0
          ? Math.round((totalSubjectCompleted / totalSubjectResources) * 100)
          : 0;

      return {
        id: sub.id,
        code: sub.code,
        name: sub.name,
        total: totalSubjectResources,
        completed: totalSubjectCompleted,
        percentage: subjectPercentage,
        units: unitsSummary,
      };
    });

    const overallPercentage =
      totalSemesterResources > 0
        ? Math.round((totalSemesterCompleted / totalSemesterResources) * 100)
        : 0;

    // Fetch details of last 5 completed items for activity feed
    const recentActivity = await this.prisma.userProgress.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: {
        resource: {
          include: {
            unit: {
              include: { subject: true },
            },
          },
        },
      },
    });

    return {
      semester: {
        id: semester.id,
        number: semester.number,
        name: semester.name,
      },
      stats: {
        overallPercentage,
        totalResources: totalSemesterResources,
        completedResources: totalSemesterCompleted,
        remainingResources: totalSemesterResources - totalSemesterCompleted,
      },
      subjects: subjectsSummary,
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        completedAt: a.completedAt,
        resourceId: a.resource.id,
        title: a.resource.title,
        fileType: a.resource.fileType,
        subjectName: a.resource.unit.subject.name,
        unitNumber: a.resource.unit.number,
      })),
    };
  }

  async toggleComplete(userId: string, resourceId: string) {
    const existing = await this.prisma.userProgress.findUnique({
      where: {
        userId_resourceId: { userId, resourceId },
      },
    });

    if (existing) {
      await this.prisma.userProgress.delete({
        where: { id: existing.id },
      });
      return { resourceId, completed: false };
    }

    // Verify resource exists
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    await this.prisma.userProgress.create({
      data: {
        userId,
        resourceId,
      },
    });

    return { resourceId, completed: true };
  }

  async checkCompleted(userId: string, resourceId: string) {
    const existing = await this.prisma.userProgress.findUnique({
      where: {
        userId_resourceId: { userId, resourceId },
      },
    });

    return { completed: !!existing };
  }

  getStatus() {
    return {
      module: "dashboard",
      status: "operational",
      features: ["progress-tracking", "semester-summary", "activity-feed"],
    };
  }
}
