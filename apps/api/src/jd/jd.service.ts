import { AiService } from "@lib/ai";
import { PrismaService } from "@lib/prisma";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { GetJob } from "./types";

const firstHalf = `
You will be given two inputs:

1. A Job Description Template written in Markdown  
2. Job Description Data containing values for placeholders

Your task is to generate a completed Markdown job description by replacing every placeholder key in the template (formatted as '[KEY_NAME]') with its corresponding value from the Job Description Data.

## Rules

- Replace **every** placeholder with its matching value from the data.
- Use the value **exactly as provided** (do not rewrite, summarize, or improve it).
- Preserve all original Markdown formatting, headings, spacing, bullet points, punctuation, and structure from the template.
- Keep the final output as **valid Markdown (.md)**.
- If a placeholder appears multiple times, replace all occurrences.
- Do not leave any unresolved placeholders unless no matching value exists in the data.
- Do not add commentary, notes, explanations, introductions, or code fences.
- Output only the completed Markdown content.

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

  async getJob(id: string): Promise<GetJob> {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async updateJob(id: string, dto: UpdateJobDto): Promise<GetJob> {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return this.prisma.job.update({
      where: { id },
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
      throw new NotFoundException('Template not found');
    }
    const prompt = `${firstHalf}\n\n${template.template}\n\n${secondHalf}\n\n${createJobDto.content}`;
    const content = await this.ai.createMessage(
      [{ role: "user", content: prompt }],
    );

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
