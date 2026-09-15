import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { GamificationService } from "./gamification.service";
import { CreateDeadlineDto } from "./dto/create-deadline.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("Gamification & Leaderboard")
@Controller("gamification")
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get("status")
  @ApiOperation({ summary: "Check gamification module status" })
  getStatus() {
    return this.gamificationService.getStatus();
  }

  @Get("leaderboard")
  @ApiOperation({ summary: "Get global student leaderboard rankings (Public)" })
  @ApiResponse({ status: 200, description: "Sorted leaderboard array" })
  async getLeaderboard() {
    return this.gamificationService.getLeaderboard();
  }

  @Get("badges")
  @ApiOperation({ summary: "Get all unlockable achievement badges (Public)" })
  async getBadges() {
    return this.gamificationService.getBadges();
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current student's streaks, badges and points" })
  async getUserProfile(@Request() req: any) {
    return this.gamificationService.getUserProfile(req.user.id);
  }

  @Get("deadlines")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get upcoming exams & assignment deadlines" })
  async getDeadlines(@Request() req: any) {
    return this.gamificationService.getDeadlines(req.user.id);
  }

  @Post("deadlines")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add a new study or exam deadline" })
  async createDeadline(@Request() req: any, @Body() dto: CreateDeadlineDto) {
    return this.gamificationService.createDeadline(req.user.id, dto);
  }

  @Patch("deadlines/:id/toggle")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle completion status of a deadline" })
  @ApiParam({ name: "id", description: "Deadline ID" })
  async toggleDeadline(@Request() req: any, @Param("id") id: string) {
    return this.gamificationService.toggleDeadline(req.user.id, id);
  }
}
