import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { JobStatus } from "generated/prisma/enums";


export class CreateJobDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	category: string;

	@IsEnum(JobStatus)
	@IsOptional()
	status?: JobStatus;

	@IsString()
	@IsNotEmpty()
	content: string;

	@IsInt()
	templateId: number;
}
