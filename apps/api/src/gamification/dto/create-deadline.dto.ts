import { IsString, IsDateString, IsOptional, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDeadlineDto {
  @ApiProperty({ example: "DBMS Mid-Sem Exam: Normalization & SQL Queries" })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: "2026-09-25T09:00:00.000Z" })
  @IsDateString()
  dueDate!: string;

  @ApiPropertyOptional({ example: "3130703" })
  @IsOptional()
  @IsString()
  subjectCode?: string;
}
