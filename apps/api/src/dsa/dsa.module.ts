import { Module } from "@nestjs/common";
import { DsaController } from "./dsa.controller";
import { DsaService } from "./dsa.service";
import { CodeRunnerService } from "./code-runner.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [DsaController],
  providers: [DsaService, CodeRunnerService],
  exports: [DsaService, CodeRunnerService],
})
export class DsaModule {}
