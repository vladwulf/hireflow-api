import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { TemplatesService } from "./templates.service";

@Controller("templates")
export class TemplatesController {
	constructor(private readonly templatesService: TemplatesService) {}

	@Get()
	async getTemplates() {
		return this.templatesService.getTemplates();
	}

	@Get(":uuid")
	async getTemplateByUuid(@Param("uuid") uuid: string) {
		return this.templatesService.getTemplateByUuid(uuid);
	}

	@Patch(":uuid")
	updateTemplate(
		@Param("uuid") uuid: string,
		@Body() dto: UpdateTemplateDto,
	) {
		return this.templatesService.updateTemplate(uuid, dto);
	}

	@Post()
	createTemplate(@Body() dto: CreateTemplateDto) {
		return this.templatesService.createTemplate(dto);
	}
}
