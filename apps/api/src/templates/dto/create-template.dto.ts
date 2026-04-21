import {  IsNotEmpty, IsString } from "class-validator";

export class CreateTemplateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString({ each: true })
	sections: string[];
}
