import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplatesService {
	constructor(private readonly prisma: PrismaService) {}
	async getTemplates() {
		return this.prisma.template.findMany();
	}

	async createTemplate(createTemplateDto: CreateTemplateDto) {
		return this.prisma.template.create({ data: createTemplateDto });
	}
}
