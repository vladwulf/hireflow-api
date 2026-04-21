import { IsOptional, IsString } from 'class-validator';

export class UpdateCandidateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cvText?: string;

  @IsString()
  @IsOptional()
  appFormText?: string;

  @IsString()
  @IsOptional()
  extraText?: string;
}
