import {
  IsString,
  IsArray,
  IsOptional,
  IsUrl,
  MinLength,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({ example: "CampusSync — Event Portal" })
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty({ example: "Fullstack campus event management platform..." })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ example: "https://github.com/username/project-repo" })
  @IsUrl()
  repoUrl!: string;

  @ApiPropertyOptional({ example: "https://demo.project.dev" })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiPropertyOptional({ example: "https://github.com/username/project/blob/main/README.md" })
  @IsOptional()
  @IsUrl()
  docsUrl?: string;

  @ApiProperty({ example: ["Web Dev", "Next.js", "TypeScript"] })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];
}

export class FilterProjectDto {
  @ApiPropertyOptional({ example: "Web Dev" })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ example: "campus" })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ enum: ["rating", "stars", "newest"] })
  @IsOptional()
  @IsString()
  sort?: "rating" | "stars" | "newest";
}

export class RateProjectDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  score!: number;

  @ApiPropertyOptional({ example: "Great architecture and clean code!" })
  @IsOptional()
  @IsString()
  feedback?: string;
}
