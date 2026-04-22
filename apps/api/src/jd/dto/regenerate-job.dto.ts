import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegenerateJobDto {
	@IsString()
	@IsNotEmpty()
	content: string;

	@IsString()
	@IsOptional()
	title?: string;
}
