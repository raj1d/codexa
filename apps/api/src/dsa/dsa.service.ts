import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CodeRunnerService } from "./code-runner.service";
import { SubmitCodeDto, FilterProblemDto } from "./dto/submit-code.dto";
import { Prisma, SubmissionStatus } from "@prisma/client";

@Injectable()
export class DsaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly codeRunner: CodeRunnerService,
  ) {}

  async getProblems(filter: FilterProblemDto) {
    const where: Prisma.ProblemWhereInput = {};

    if (filter.difficulty) where.difficulty = filter.difficulty;
    if (filter.topic) where.topic = filter.topic;
    if (filter.query) {
      where.OR = [
        { title: { contains: filter.query, mode: "insensitive" } },
        { description: { contains: filter.query, mode: "insensitive" } },
      ];
    }

    const problems = await this.prisma.problem.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: {
            testCases: true,
            submissions: true,
          },
        },
      },
    });

    return problems.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
      totalTestCases: p._count.testCases,
      totalSubmissions: p._count.submissions,
    }));
  }

  async getProblemBySlug(slug: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { slug },
      include: {
        testCases: {
          where: { isHidden: false }, // Only return public test cases
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            isHidden: true,
          },
        },
      },
    });

    if (!problem) {
      throw new NotFoundException(`Problem '${slug}' not found`);
    }

    return problem;
  }

  async submitCode(userId: string, dto: SubmitCodeDto) {
    const problem = await this.prisma.problem.findUnique({
      where: { slug: dto.problemSlug },
      include: {
        testCases: true,
      },
    });

    if (!problem) {
      throw new NotFoundException(`Problem '${dto.problemSlug}' not found`);
    }

    // Execute code through sandboxed runner
    const execution = await this.codeRunner.execute(
      dto.language,
      dto.code,
      problem.testCases,
      problem.timeLimit,
    );

    const submissionStatus: SubmissionStatus =
      execution.status === "PASSED"
        ? SubmissionStatus.PASSED
        : execution.status === "COMPILATION_ERROR"
          ? SubmissionStatus.COMPILATION_ERROR
          : SubmissionStatus.FAILED;

    const submission = await this.prisma.submission.create({
      data: {
        userId,
        problemId: problem.id,
        language: dto.language,
        code: dto.code,
        status: submissionStatus,
        passedTestCases: execution.passedTestCases,
        totalTestCases: execution.totalTestCases,
        runtimeMs: execution.totalRuntimeMs,
        output: execution.terminalLog,
        errorMessage: execution.errorMessage || null,
      },
    });

    return {
      submissionId: submission.id,
      status: submission.status,
      passedTestCases: execution.passedTestCases,
      totalTestCases: execution.totalTestCases,
      runtimeMs: execution.totalRuntimeMs,
      testCaseResults: execution.testCaseResults,
      terminalLog: execution.terminalLog,
    };
  }

  async getUserSubmissions(userId: string, problemSlug?: string) {
    const where: Prisma.SubmissionWhereInput = { userId };

    if (problemSlug) {
      const problem = await this.prisma.problem.findUnique({
        where: { slug: problemSlug },
      });
      if (problem) {
        where.problemId = problem.id;
      }
    }

    return this.prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        problem: {
          select: { title: true, slug: true, difficulty: true, topic: true },
        },
      },
    });
  }

  async getTopics() {
    const problems = await this.prisma.problem.findMany({
      select: { topic: true, difficulty: true },
    });

    const topicCounts: Record<string, { total: number; easy: number; medium: number; hard: number }> = {};

    for (const p of problems) {
      if (!topicCounts[p.topic]) {
        topicCounts[p.topic] = { total: 0, easy: 0, medium: 0, hard: 0 };
      }
      topicCounts[p.topic].total += 1;
      if (p.difficulty === "EASY") topicCounts[p.topic].easy += 1;
      if (p.difficulty === "MEDIUM") topicCounts[p.topic].medium += 1;
      if (p.difficulty === "HARD") topicCounts[p.topic].hard += 1;
    }

    return Object.entries(topicCounts).map(([topic, counts]) => ({
      topic,
      ...counts,
    }));
  }

  getStatus() {
    return {
      module: "dsa",
      status: "operational",
      features: ["monaco-sandbox", "multi-language", "hidden-test-cases", "verdicts"],
    };
  }
}
