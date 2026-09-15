import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ResourceStatus } from "@prisma/client";

export class UpdateResourceStatusDto {
  @ApiProperty({ enum: ResourceStatus, example: ResourceStatus.APPROVED })
  @IsEnum(ResourceStatus)
  status!: ResourceStatus;
}
