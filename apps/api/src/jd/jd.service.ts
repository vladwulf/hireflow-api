import { AiService } from "@lib/ai";
import { PrismaService } from "@lib/prisma";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { GetJob } from "./types";

const firstHalf = `
You are a senior technical recruiter generating a professional, external-facing job description.

You will be given two inputs:
1. A **Job Description Template** written in Markdown, with placeholders formatted as "[KEY_NAME]"
2. **Job Description Data** containing values for those placeholders — sourced from raw internal kick-off call notes

Your task is to produce a completed Markdown job description by replacing every placeholder with its corresponding value, after applying the filtering rules below.

---

## Step 1 — Filter each value before inserting it

Apply these rules to every value before it enters the template:

**Rule 1 — No internal names**
Remove any names of team members, managers, colleagues, or hiring managers. If removing a name makes the sentence grammatically broken, rephrase the surrounding text so it reads naturally. Do not substitute a different name or role.

> Before: "You'll report to Sarah and own the data pipeline."
> After: "You'll own the data pipeline."

**Rule 2 — No roadmap or future-facing content**
Remove any tools, systems, features, or responsibilities described as planned, upcoming, in the roadmap, coming soon, in the future, or not yet in use. Only include what is currently live and actively used. If a bullet point's entire content is roadmap items, remove the bullet entirely — do not leave a blank bullet or placeholder.

**Rule 3 — No duplicate requirements**
Within the completed document, every bullet point must express a distinct requirement or responsibility. Two bullets are duplicates if a candidate who meets one would automatically meet the other — even if the wording differs. For example, "5+ years of Python experience" and "strong Python skills required" are duplicates; keep only the more specific one.

**Rule 4 — No internal context**
Remove references to internal processes, team structure, headcount, budget, interviewer names, internal tools not relevant to the role (e.g. internal Slack channels, internal codenames), or hiring process details. If removing this content leaves a value empty, omit the field entirely — remove its heading and any surrounding blank lines too.

**Rule 5 — Order bullets by candidate relevance, within the template's section structure**
Do not change which sections exist or reorder sections. Within each section's bullet list, order bullets from most to least important for a candidate assessing their fit. Technical requirements and hard skills come first. If a location, timezone, or regional requirement exists (e.g. "must be EMEA-based"), it must appear immediately after technical requirements — not at the end.

---

## Step 2 — Insert filtered values into the template

- Replace every placeholder with its filtered value.
- If a placeholder's value was entirely removed by the filtering rules, remove the placeholder and any bullet point, line, or heading that only existed to contain it. Do not leave blank lines, empty bullets, or unresolved placeholders.
- If a placeholder appears multiple times in the template, apply the same filtered value to all occurrences.
- Preserve all original Markdown formatting, headings, spacing, and structure that is not affected by filtering.
- Do not add information that was not present in the source data.
- Do not add commentary, notes, explanations, introductions, or code fences.
- Output only the completed Markdown content.

---

## Tone

Direct, specific, and honest. Avoid buzzwords and vague language. Write for an external candidate who knows nothing about the company's internal workings.

---

## Input

### Job Description Template`;

const secondHalf = `### Job Description Data`;

@Injectable()
export class JdService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly ai: AiService,
	) {}

	async getJobs(): Promise<GetJob[]> {
		return this.prisma.job.findMany();
	}

	async getJob(uuid: string): Promise<GetJob> {
		const job = await this.prisma.job.findUnique({ where: { uuid } });
		if (!job) {
			throw new NotFoundException("Job not found");
		}
		return job;
	}

	async updateJobStatus(uuid: string): Promise<GetJob> {
		const job = await this.prisma.job.findUnique({ where: { uuid } });
		if (!job) throw new NotFoundException("Job not found");
		return this.prisma.job.update({
			where: { uuid },
			data: { status: job.status === "ACTIVE" ? "CLOSED" : "ACTIVE" },
		});
	}

	async deleteJob(id: number): Promise<void> {
		await this.prisma.job.delete({ where: { id } });
	}

	async updateJob(id: number, dto: UpdateJobDto): Promise<GetJob> {
		const job = await this.prisma.job.findUnique({ where: { id } });
		if (!job) throw new NotFoundException("Job not found");
		return this.prisma.job.update({
			where: { uuid: job.uuid },
			data: { content: dto.content },
		});
	}

	async createJob(createJobDto: CreateJobDto): Promise<GetJob> {
		const template = await this.prisma.template.findUnique({
			where: {
				uuid: createJobDto.templateUuid,
			},
		});
		if (!template) {
			throw new NotFoundException("Template not found");
		}
		const prompt = `${firstHalf}\n\n${template.template}\n\n${secondHalf}\n\n${createJobDto.content}`;
		const content = await this.ai.createMessage([
			{ role: "user", content: prompt },
		]);

		return this.prisma.job.create({
			data: {
				title: createJobDto.title,
				category: createJobDto.category,
				content,
				templateId: template.id,
			},
		});
	}
}
