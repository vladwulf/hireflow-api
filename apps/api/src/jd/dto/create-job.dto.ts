import {  IsNotEmpty, IsString } from "class-validator";



export class CreateJobDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	category: string;

	@IsString()
	@IsNotEmpty()
	content: string;

	@IsString()
	@IsNotEmpty()
	templateUuid: string;
}
