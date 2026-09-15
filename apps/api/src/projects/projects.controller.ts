import {
  Controller,
  Get,
  Post,
  Param,
  Query,
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
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, FilterProjectDto, RateProjectDto } from "./dto/create-project.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("Project Hub")
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get("status")
  @ApiOperation({ summary: "Check Project Hub module status" })
  getStatus() {
    return this.projectsService.getStatus();
  }

  @Get("tags")
  @ApiOperation({ summary: "Get popular project tags with counts (Public)" })
  async getTags() {
    return this.projectsService.getTags();
  }

  @Get()
  @ApiOperation({ summary: "List open-source projects with filters and sorting (Public)" })
  @ApiResponse({ status: 200, description: "Array of project cards" })
  async getProjects(@Query() filter: FilterProjectDto) {
    return this.projectsService.getProjects(filter);
  }

  @Get("user/bookmarks")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's bookmarked projects" })
  async getUserBookmarks(@Request() req: any) {
    return this.projectsService.getUserBookmarks(req.user.id);
  }

  @Get(":slug")
  @ApiOperation({ summary: "Get project details by slug (Public)" })
  @ApiParam({ name: "slug", example: "campus-sync-portal" })
  async getProjectBySlug(
    @Param("slug") slug: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id;
    return this.projectsService.getProjectBySlug(slug, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Submit a student open-source project (Auth Required)" })
  @ApiResponse({ status: 201, description: "Project submitted and listed" })
  async createProject(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.id, dto);
  }

  @Post(":id/rate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Rate a project (1-5 stars) with optional feedback" })
  async rateProject(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: RateProjectDto,
  ) {
    return this.projectsService.rateProject(req.user.id, id, dto);
  }

  @Post(":id/bookmark")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle bookmark status of a project" })
  async toggleBookmark(
    @Request() req: any,
    @Param("id") id: string,
  ) {
    return this.projectsService.toggleBookmark(req.user.id, id);
  }
}
