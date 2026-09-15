import {
  Controller,
  Get,
  Post,
  Patch,
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
import { StudyHubService } from "./study-hub.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { FilterResourceDto } from "./dto/filter-resource.dto";
import { UpdateResourceStatusDto } from "./dto/update-status.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AdminGuard } from "../auth/roles.guard";

@ApiTags("Study Hub")
@Controller("study-hub")
export class StudyHubController {
  constructor(private readonly studyHubService: StudyHubService) {}

  @Get("status")
  @ApiOperation({ summary: "Check study hub service status" })
  getStatus() {
    return this.studyHubService.getStatus();
  }

  @Get("semesters")
  @ApiOperation({ summary: "Get all curriculum semesters (Public)" })
  @ApiResponse({ status: 200, description: "List of semesters with subject counts" })
  async getSemesters() {
    return this.studyHubService.getSemesters();
  }

  @Get("subjects")
  @ApiOperation({ summary: "Get subjects by semester ID or all subjects (Public)" })
  @ApiResponse({ status: 200, description: "List of subjects with unit counts" })
  async getSubjects(@Query("semesterId") semesterId?: string) {
    return this.studyHubService.getSubjects(semesterId);
  }

  @Get("subjects/:id")
  @ApiOperation({ summary: "Get single subject with all units (Public)" })
  @ApiParam({ name: "id", description: "Subject ID" })
  async getSubjectById(@Param("id") id: string) {
    return this.studyHubService.getSubjectById(id);
  }

  @Get("subjects/:id/units")
  @ApiOperation({ summary: "Get units for a subject (Public)" })
  @ApiParam({ name: "id", description: "Subject ID" })
  async getUnits(@Param("id") subjectId: string) {
    return this.studyHubService.getUnits(subjectId);
  }

  @Get("resources")
  @ApiOperation({ summary: "Search & filter study resources (Public)" })
  @ApiResponse({ status: 200, description: "List of matching approved study resources" })
  async getResources(@Query() filter: FilterResourceDto) {
    return this.studyHubService.getResources(filter);
  }

  @Get("resources/pending")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get pending resources for admin moderation (Owner Only)" })
  async getPendingResources() {
    return this.studyHubService.getPendingResources();
  }

  @Get("resources/:id")
  @ApiOperation({ summary: "Get single resource details (Public)" })
  @ApiParam({ name: "id", description: "Resource ID" })
  async getResourceById(@Param("id") id: string) {
    return this.studyHubService.getResourceById(id);
  }

  @Get("resources/:id/download")
  @ApiOperation({ summary: "Get resource download / view presigned URL (Public)" })
  @ApiParam({ name: "id", description: "Resource ID" })
  async getDownloadUrl(@Param("id") id: string) {
    return this.studyHubService.getDownloadUrl(id);
  }

  @Post("resources")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload a new study resource (Auth Required)" })
  @ApiResponse({ status: 201, description: "Resource submitted for moderation" })
  async createResource(@Request() req: any, @Body() dto: CreateResourceDto) {
    return this.studyHubService.createResource(req.user.id, dto);
  }

  @Patch("resources/:id/status")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Approve or reject a resource (Platform Owner Only)" })
  @ApiParam({ name: "id", description: "Resource ID" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateResourceStatusDto,
  ) {
    return this.studyHubService.updateStatus(id, dto.status);
  }
}
