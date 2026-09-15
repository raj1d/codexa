import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("status")
  @ApiOperation({ summary: "Check dashboard service status" })
  getStatus() {
    return this.dashboardService.getStatus();
  }

  @Get("summary")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get semester progress summary for authenticated student" })
  @ApiQuery({ name: "semester", required: false, example: 3 })
  async getSummary(
    @Request() req: any,
    @Query("semester") semester?: string,
  ) {
    const semNum = semester ? parseInt(semester, 10) : 3;
    return this.dashboardService.getSummary(req.user.id, semNum);
  }

  @Post("progress/toggle/:resourceId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle completion status of a study resource" })
  async toggleComplete(
    @Request() req: any,
    @Param("resourceId") resourceId: string,
  ) {
    return this.dashboardService.toggleComplete(req.user.id, resourceId);
  }

  @Get("progress/check/:resourceId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Check if resource is completed by current user" })
  async checkCompleted(
    @Request() req: any,
    @Param("resourceId") resourceId: string,
  ) {
    return this.dashboardService.checkCompleted(req.user.id, resourceId);
  }
}
