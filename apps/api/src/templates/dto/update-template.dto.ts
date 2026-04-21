import { IsNotEmpty, IsString } from "class-validator";

export class UpdateTemplateDto {
	@IsString()
	@IsNotEmpty()
	template: string;
}
