import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../common/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { OAuthSyncDto } from "./dto/oauth-sync.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const adminEmail = process.env.ADMIN_EMAIL || "raj.prajapati@codexa.dev";
    const adminGithub = process.env.ADMIN_GITHUB_USERNAME || "rajprajapati";

    const isOwner =
      dto.email.toLowerCase() === adminEmail.toLowerCase() ||
      dto.githubUsername?.toLowerCase() === adminGithub.toLowerCase() ||
      dto.name.toLowerCase().includes("raj prajapati");

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
        githubUsername: dto.githubUsername || null,
        role: isOwner ? "ADMIN" : "STUDENT",
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        githubUsername: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user,
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      githubUsername: user.githubUsername,
      role: user.role,
      token,
    };
  }

  async syncOAuthUser(dto: OAuthSyncDto) {
    const email = dto.email.toLowerCase();

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    const adminEmail = process.env.ADMIN_EMAIL || "raj.prajapati@codexa.dev";
    const adminGithub = process.env.ADMIN_GITHUB_USERNAME || "rajprajapati";

    const isOwner =
      email === adminEmail.toLowerCase() ||
      dto.githubUsername?.toLowerCase() === adminGithub.toLowerCase() ||
      dto.name.toLowerCase().includes("raj prajapati");

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: dto.name,
          avatarUrl: dto.avatarUrl || null,
          githubUsername: dto.githubUsername || null,
          githubId: dto.githubId || null,
          role: isOwner ? "ADMIN" : "STUDENT",
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: dto.name || user.name,
          avatarUrl: dto.avatarUrl || user.avatarUrl,
          githubUsername: dto.githubUsername || user.githubUsername,
          githubId: dto.githubId || user.githubId,
          role: isOwner ? "ADMIN" : user.role,
        },
      });
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      githubUsername: user.githubUsername,
      role: user.role,
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        githubUsername: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            uploadedResources: true,
            progress: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  getStatus() {
    return {
      module: "auth",
      status: "operational",
      features: ["credentials", "github-oauth", "jwt"],
    };
  }

  private generateToken(userId: string, email: string, role: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }
}
