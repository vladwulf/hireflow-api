import { PrismaService } from "@lib/prisma";
import { Injectable } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/create-template.dto";

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
				jobDescription: createTemplateDto.description,
				category: createTemplateDto.category,
				tags: createTemplateDto.tags ?? [],
			},
		});
	}
}
