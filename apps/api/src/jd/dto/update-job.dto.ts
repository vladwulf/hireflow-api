import { IsNotEmpty, IsString } from "class-validator";

export class UpdateJobDto {
	@IsString()
	@IsNotEmpty()
	content: string;
}
