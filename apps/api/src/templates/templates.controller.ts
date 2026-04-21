import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { TemplatesService } from "./templates.service";

@Controller("templates")
export class TemplatesController {
	constructor(private readonly templatesService: TemplatesService) {}

	@Get()
	async getTemplates() {
		return this.templatesService.getTemplates();
	}

	@Post()
	createTemplate(@Body() dto: CreateTemplateDto) {
		return this.templatesService.createTemplate(dto);
	}
}
