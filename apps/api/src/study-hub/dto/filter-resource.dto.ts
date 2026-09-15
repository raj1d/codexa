import { IsOptional, IsString, IsEnum, IsUUID } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { FileType, ResourceStatus } from "@prisma/client";

export class FilterResourceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  semesterId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  subjectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  unitId?: string;

  @ApiPropertyOptional({ enum: FileType })
  @IsOptional()
  @IsEnum(FileType)
  fileType?: FileType;

  @ApiPropertyOptional({ enum: ResourceStatus })
  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @ApiPropertyOptional({ example: "normalization" })
  @IsOptional()
  @IsString()
  query?: string;
}
