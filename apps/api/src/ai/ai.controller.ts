import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { AskAiDto, SummarizeDto } from "./dto/ask-ai.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@ApiTags("AI Assistant")
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("suggestions")
  @ApiOperation({ summary: "Get suggested syllabus study questions (Public)" })
  async getSuggestedQuestions() {
    return this.aiService.getSuggestedQuestions();
  }

  @Post("query")
  @ApiOperation({ summary: "Ask syllabus-grounded AI question with citations" })
  @ApiResponse({ status: 200, description: "Structured answer with source citations" })
  async askQuestion(@Body() dto: AskAiDto) {
    return this.aiService.askQuestion(dto);
  }

  @Post("summarize")
  @ApiOperation({ summary: "Summarize study notes / PDF text and generate quiz questions" })
  async summarizeContent(@Body() dto: SummarizeDto) {
    return this.aiService.summarizeContent(dto);
  }
}
