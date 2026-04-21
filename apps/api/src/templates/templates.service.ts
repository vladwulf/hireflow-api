import { AiService } from "@lib/ai";
import { PrismaService } from "@lib/prisma";
import { Injectable } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { GetTemplates } from "./types";

const metaPrompt = `You are a Job Description Template Architect. Your task is to analyze the job description provided by the user and extract a reusable template that captures its structure, format, tone, and writing style — without keeping any role-specific content.

Follow these steps:

## STEP 1 — ANALYZE THE JD
Carefully read the job description and identify:
- The sections present and their order
- The writing style (formal, conversational, direct, etc.)
- The tone (corporate, startup, technical, inclusive, etc.)
- How each section is formatted (bullets, paragraphs, headers, etc.)
- Any recurring patterns (e.g., how requirements are phrased, how the company is introduced)

## STEP 2 — BUILD THE TEMPLATE
Replace all specific content with clear placeholders using this format: **[PLACEHOLDER_NAME]**

Rules for building the template:
- Keep every section that appeared in the original JD, in the same order
- Preserve the sentence structure and phrasing patterns — only swap specifics for placeholders
- If a section uses bullet points, keep bullet points in the template
- If a section uses paragraphs, keep paragraphs
- Make placeholder names descriptive and self-explanatory
- Use **##** for section headings, **-** for bullet lists, and **bold** for emphasis where the original JD used it

## STEP 3 — OUTPUT
Return only the raw Markdown template text with placeholders.
- Format the entire output as valid Markdown
- Use ## for top-level section headings
- Use ### for sub-section headings if present
- Use - for bullet lists
- Use **bold** for placeholder names: **[PLACEHOLDER_NAME]**
- Do not include style notes, glossaries, meta-commentary, or any text outside the template itself
- The output must be clean Markdown ready to be rendered in a browser and stored directly in a database

Now, wait for the user to provide their job description.`;

function toDto(t: {
	name: string;
	uuid: string;
	category: string;
	description: string;
	template: string | null;
	tags: string[];
}): GetTemplates {
	return {
		name: t.name,
		uuid: t.uuid,
		category: t.category,
		description: t.description,
		template: t.template,
		tags: t.tags,
	};
}

@Injectable()
export class TemplatesService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly ai: AiService,
	) {}

	async getTemplates(): Promise<GetTemplates[]> {
		const rows = await this.prisma.template.findMany();
		return rows.map(toDto);
	}

	async getTemplateByUuid(uuid: string): Promise<GetTemplates> {
		const row = await this.prisma.template.findUniqueOrThrow({
			where: { uuid },
		});

		if (row.template) {
			return toDto(row);
		}

		// Lazily generate the AI template and cache it
		const generated = await this.ai.createMessage(
			[{ role: "user", content: row.description }],
			{ system: metaPrompt },
		);

		const updated = await this.prisma.template.update({
			where: { uuid },
			data: { template: generated },
		});

		return toDto(updated);
	}

	async createTemplate(createTemplateDto: CreateTemplateDto): Promise<GetTemplates> {
		const row = await this.prisma.template.create({
			data: {
				name: createTemplateDto.name,
				description: createTemplateDto.description,
				category: createTemplateDto.category,
				tags: createTemplateDto.tags ?? [],
			},
		});

		return toDto(row);
	}
}
