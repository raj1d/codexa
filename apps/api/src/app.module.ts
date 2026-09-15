import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./common/prisma.module";
import { RedisModule } from "./common/redis.module";
import { MeilisearchModule } from "./common/meilisearch.module";
import { StorageModule } from "./common/storage.module";
import { AuthModule } from "./auth/auth.module";
import { StudyHubModule } from "./study-hub/study-hub.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DsaModule } from "./dsa/dsa.module";
import { ProjectsModule } from "./projects/projects.module";
import { AiModule } from "./ai/ai.module";
import { GamificationModule } from "./gamification/gamification.module";
import { GlobalSearchController } from "./global-search.controller";

@Module({
  imports: [
    // Load .env from monorepo root
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    PrismaModule,
    RedisModule,
    MeilisearchModule,
    StorageModule,
    AuthModule,
    StudyHubModule,
    DashboardModule,
    DsaModule,
    ProjectsModule,
    AiModule,
    GamificationModule,
  ],
  controllers: [GlobalSearchController],
})
export class AppModule {}
