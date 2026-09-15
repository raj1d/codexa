import { IsEmail, IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OAuthSyncDto {
  @ApiProperty({ example: "student@gtu.edu" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Alex Mercer" })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: "https://avatars.githubusercontent.com/u/12345" })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: "alexmercer" })
  @IsOptional()
  @IsString()
  githubUsername?: string;

  @ApiPropertyOptional({ example: "12345678" })
  @IsOptional()
  @IsString()
  githubId?: string;
}
