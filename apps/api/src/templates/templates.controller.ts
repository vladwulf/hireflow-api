import { Body, Controller, Get, Post } from "@nestjs/common";
import type { CreateTemplateDto } from "./dto/create-template.dto";
import type { TemplatesService } from "./templates.service";

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
