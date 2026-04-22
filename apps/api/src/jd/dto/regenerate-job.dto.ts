import { IsOptional, IsString } from "class-validator";

export class RegenerateJobDto {
	@IsString()
	@IsOptional()
	content?: string;

	@IsString()
	@IsOptional()
	title?: string;
}
