import { IsString, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AskAiDto {
  @ApiProperty({ example: "Explain BCNF normalization in DBMS and how it differs from 3NF." })
  @IsString()
  question!: string;

  @ApiPropertyOptional({ example: "doc-uuid" })
  @IsOptional()
  @IsString()
  docId?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isBeginner?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isVivaMode?: boolean;
}

export class SummarizeDto {
  @ApiProperty({ example: "Paging is a memory management scheme that eliminates the need for contiguous allocation of physical memory..." })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ example: "Operating Systems — Paging & Virtual Memory" })
  @IsOptional()
  @IsString()
  title?: string;
}
