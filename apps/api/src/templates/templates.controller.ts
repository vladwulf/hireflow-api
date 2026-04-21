import { Controller } from "@nestjs/common";
import type { TemplatesService } from "./templates.service";

@Controller("templates")
export class TemplatesController {
	constructor(private readonly templatesService: TemplatesService) {}

	@Get()
	async getTemplates() {
		return this.templatesService.getTemplates();
	}

	@Post()
  createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.createTemplate(createTemplateDto);
  }
}
