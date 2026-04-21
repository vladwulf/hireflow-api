import type { PrismaService } from "@lib/prisma";
import { Injectable } from "@nestjs/common";
import type { CreateTemplateDto } from "./dto/create-template.dto";

@Injectable()
export class TemplatesService {
	constructor(private readonly prisma: PrismaService) {}
	async getTemplates() {
		return this.prisma.template.findMany();
	}

	async createTemplate(createTemplateDto: CreateTemplateDto) {
		return this.prisma.template.create({
			data: {
				name: createTemplateDto.name,
				description: createTemplateDto.description,
			},
		});
	}
}
