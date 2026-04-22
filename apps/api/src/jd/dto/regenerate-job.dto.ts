import { IsNotEmpty, IsString } from "class-validator";

export class RegenerateJobDto {
	@IsString()
	@IsNotEmpty()
	content: string;
}
