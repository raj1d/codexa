import { IsString, IsEnum, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Difficulty } from "@prisma/client";

export class SubmitCodeDto {
  @ApiProperty({ example: "two-sum" })
  @IsString()
  problemSlug!: string;

  @ApiProperty({ example: "python", enum: ["python", "javascript", "cpp", "java", "c"] })
  @IsString()
  language!: string;

  @ApiProperty({ example: "class Solution:\n    def twoSum(self, nums, target):\n        return [0, 1]" })
  @IsString()
  code!: string;
}

export class FilterProblemDto {
  @ApiPropertyOptional({ enum: Difficulty })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({ example: "arrays" })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ example: "two sum" })
  @IsOptional()
  @IsString()
  query?: string;
}
