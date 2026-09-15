import { Module } from "@nestjs/common";
import { StudyHubController } from "./study-hub.controller";
import { StudyHubService } from "./study-hub.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [StudyHubController],
  providers: [StudyHubService],
  exports: [StudyHubService],
})
export class StudyHubModule {}
