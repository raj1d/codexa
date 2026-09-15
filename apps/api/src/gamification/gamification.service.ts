import {
  Injectable,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { RedisService } from "../common/redis.service";
import { CreateDeadlineDto } from "./dto/create-deadline.dto";

const LEADERBOARD_REDIS_KEY = "codexa:leaderboard:points";

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      include: {
        streak: true,
        badges: {
          include: { badge: true },
        },
        _count: {
          select: {
            submissions: { where: { status: "PASSED" } },
            uploadedResources: { where: { status: "APPROVED" } },
            progress: true,
          },
        },
      },
    });

    const leaderboard = users.map((u) => {
      const solves = u._count.submissions;
      const streakDays = u.streak?.currentStreak || 0;
      const uploads = u._count.uploadedResources;
      const badgePoints = u.badges.reduce((acc, b) => acc + b.badge.points, 0);

      // Points formula: 100 per DSA solve + 20 per streak day + 150 per note upload + badge bonus
      const totalPoints = solves * 100 + streakDays * 20 + uploads * 150 + badgePoints;

      return {
        id: u.id,
        name: u.name,
        githubUsername: u.githubUsername,
        avatarUrl: u.avatarUrl,
        solves,
        streakDays,
        uploads,
        badgesCount: u.badges.length,
        badges: u.badges.map((b) => ({
          name: b.badge.name,
          slug: b.badge.slug,
          icon: b.badge.icon,
        })),
        totalPoints,
      };
    });

    // Sort by points descending
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    // Sync to Redis sorted set
    for (const item of leaderboard) {
      try {
        await this.redis.zadd(LEADERBOARD_REDIS_KEY, item.totalPoints, item.id);
      } catch (err: any) {
        // Continue if Redis write fails
      }
    }

    // Attach rank numbers
    return leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
  }

  async getBadges() {
    return this.prisma.badge.findMany({
      orderBy: { points: "asc" },
    });
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        streak: true,
        badges: {
          include: { badge: true },
        },
        _count: {
          select: {
            submissions: { where: { status: "PASSED" } },
            uploadedResources: { where: { status: "APPROVED" } },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const leaderboard = await this.getLeaderboard();
    const rankEntry = leaderboard.find((l) => l.id === userId);

    return {
      userId: user.id,
      name: user.name,
      githubUsername: user.githubUsername,
      rank: rankEntry?.rank || leaderboard.length + 1,
      currentStreak: user.streak?.currentStreak || 1,
      longestStreak: user.streak?.longestStreak || 1,
      totalSolves: user._count.submissions,
      totalUploads: user._count.uploadedResources,
      totalPoints: rankEntry?.totalPoints || 100,
      badges: user.badges.map((b) => b.badge),
    };
  }

  async getDeadlines(userId: string) {
    return this.prisma.deadline.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    });
  }

  async createDeadline(userId: string, dto: CreateDeadlineDto) {
    return this.prisma.deadline.create({
      data: {
        userId,
        title: dto.title,
        dueDate: new Date(dto.dueDate),
        subjectCode: dto.subjectCode || null,
      },
    });
  }

  async toggleDeadline(userId: string, id: string) {
    const deadline = await this.prisma.deadline.findFirst({
      where: { id, userId },
    });

    if (!deadline) {
      throw new NotFoundException("Deadline not found");
    }

    return this.prisma.deadline.update({
      where: { id },
      data: { isCompleted: !deadline.isCompleted },
    });
  }

  getStatus() {
    return {
      module: "gamification",
      status: "operational",
      features: ["streaks", "badges", "redis-leaderboard", "deadlines"],
    };
  }
}
