import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsUrl,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FileType } from "@prisma/client";

export class CreateResourceDto {
  @ApiProperty({ example: "DBMS Unit 1 Complete Handwritten Notes" })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiPropertyOptional({ example: "Covers relational model, ER diagrams with examples." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: FileType, example: FileType.NOTES })
  @IsEnum(FileType)
  fileType!: FileType;

  @ApiProperty({ example: "https://uploads.codexa.dev/dbms-unit1.pdf" })
  @IsString()
  fileUrl!: string;

  @ApiProperty({ example: "semester-uuid" })
  @IsUUID()
  semesterId!: string;

  @ApiProperty({ example: "subject-uuid" })
  @IsUUID()
  subjectId!: string;

  @ApiProperty({ example: "unit-uuid" })
  @IsUUID()
  unitId!: string;
}
