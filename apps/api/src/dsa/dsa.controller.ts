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
import { DsaService } from "./dsa.service";
import { SubmitCodeDto, FilterProblemDto } from "./dto/submit-code.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("DSA Practice")
@Controller("dsa")
export class DsaController {
  constructor(private readonly dsaService: DsaService) {}

  @Get("status")
  @ApiOperation({ summary: "Check DSA module status" })
  getStatus() {
    return this.dsaService.getStatus();
  }

  @Get("topics")
  @ApiOperation({ summary: "Get list of DSA topics with problem counts (Public)" })
  async getTopics() {
    return this.dsaService.getTopics();
  }

  @Get("problems")
  @ApiOperation({ summary: "List DSA problems with filters (Public)" })
  @ApiResponse({ status: 200, description: "Array of problem summaries" })
  async getProblems(@Query() filter: FilterProblemDto) {
    return this.dsaService.getProblems(filter);
  }

  @Get("problems/:slug")
  @ApiOperation({ summary: "Get problem details with templates and public test cases (Public)" })
  @ApiParam({ name: "slug", example: "two-sum" })
  async getProblemBySlug(@Param("slug") slug: string) {
    return this.dsaService.getProblemBySlug(slug);
  }

  @Post("submit")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Submit solution for testing & evaluation (Auth Required)" })
  async submitCode(@Request() req: any, @Body() dto: SubmitCodeDto) {
    return this.dsaService.submitCode(req.user.id, dto);
  }

  @Get("submissions")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user's past submission history" })
  async getUserSubmissions(
    @Request() req: any,
    @Query("problemSlug") problemSlug?: string,
  ) {
    return this.dsaService.getUserSubmissions(req.user.id, problemSlug);
  }
}
