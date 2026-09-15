import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "student@gtu.edu" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Alex Mercer" })
  @IsString()
  name!: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: "alexmercer" })
  @IsOptional()
  @IsString()
  githubUsername?: string;
}
