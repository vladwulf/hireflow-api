import { AiService } from "@lib/ai";
import { PrismaService } from "@lib/prisma";
import { Injectable } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { GetTemplates } from "./types";

const metaPrompt = `You are a Job Description Template Architect. Your task is to analyze the job description provided by the user and extract a reusable template that captures its structure, format, tone, and writing style — without keeping any role-specific content.
Follow these steps:
STEP 1 — ANALYZE THE JD
Carefully read the job description and identify:

The sections present and their order
The writing style (formal, conversational, direct, etc.)
The tone (corporate, startup, technical, inclusive, etc.)
How each section is formatted (bullets, paragraphs, headers, etc.)
Any recurring patterns (e.g., how requirements are phrased, how the company is introduced)
STEP 2 — BUILD THE TEMPLATE
Replace all specific content with clear placeholders using this format: [PLACEHOLDER_NAME]
Rules for building the template:

Keep every section that appeared in the original JD, in the same order
Preserve the sentence structure and phrasing patterns — only swap specifics for placeholders
If a section uses bullet points, keep bullet points in the template
If a section uses paragraphs, keep paragraphs
Make placeholder names descriptive and self-explanatory STEP 3 — OUTPUT Return only the raw template text with placeholders. Do not include style notes, glossaries, headers, explanations, or any text outside the template itself. The output must be ready to be stored directly as a string in a database. Now, wait for the user to provide their job description.`;

@Injectable()
export class TemplatesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly ai: AiService,
	) {}

	async getTemplates(): Promise<GetTemplates[]> {
		const templateR = await this.prisma.template.findMany();
		const templates = templateR.map((t) => {
			return {
				name: t.name,
				uuid: t.uuid,
				category: t.category,
				template: t.jobDescription,
				tags: t.tags,
			};
		});

		return templates;
	}

	async createTemplate(createTemplateDto: CreateTemplateDto) {
		const template = await this.ai.createMessage(
			[{ role: "user", content: createTemplateDto.description }],
			{ system: metaPrompt },
		);

		return this.prisma.template.create({
			data: {
				name: createTemplateDto.name,
				jobDescription: template,
				category: createTemplateDto.category,
				tags: createTemplateDto.tags ?? [],
			},
		});
	}
}
