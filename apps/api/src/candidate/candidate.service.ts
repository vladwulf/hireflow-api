import { AiService } from "@lib/ai";
import { PrismaService } from "@lib/prisma";
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateDto } from "./dto/update-candidate.dto";
import { GetCandidate } from "./types";

const SCORING_SYSTEM_PROMPT = `You are a recruitment scoring assistant. Given a job description, a candidate CV, meeting notes (if available), and extra candidate data from application forms or screening questions (if available), evaluate how well the candidate fits the role.

Output ONLY a valid JSON object matching this exact structure. Do not output anything else — no explanation, no markdown, no extra text.

{ "overall": 0, "skillsMatch": 0, "experience": 0, "cultureFit": 0, "summary": "", "pros": [], "cons": [] }

Field definitions:

overall: Integer from 0 to 100 representing total fit for the role
skillsMatch: Integer from 0 to 100 based on technical / functional skill alignment
experience: Integer from 0 to 100 based on relevant industry background, years, seniority, and role scope
cultureFit: Integer from 0 to 100 based on communication, motivation, professionalism, values alignment, and team fit (use meeting notes if available; otherwise infer conservatively)
summary: Short neutral summary (1–3 sentences)
pros: Array of concise strengths
cons: Array of concise gaps, risks, or missing requirements

Scoring criteria:

Technical skills match
Relevant industry experience
Years of experience vs requirements
Location requirements (hard disqualifier if not met)
Seniority and role alignment
Evidence from meeting notes
Additional screening/form responses
Clear red flags or strengths

Rules:

If meeting notes are "N/A", use only available evidence.
If extra data is "N/A", use only available evidence.
If critical information is missing, score based on available evidence and note uncertainty in summary or cons.
Penalize hard requirement mismatches.
Reward direct alignment with must-have requirements.
Be strict and realistic. Do not inflate scores.
Ensure all numeric fields are integers only.`;

@Injectable()
export class CandidateService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly ai: AiService,
	) {}

	async getCandidatesByJob(jobUuid: string): Promise<GetCandidate[]> {
		const job = await this.prisma.job.findUnique({ where: { uuid: jobUuid } });
		if (!job) throw new NotFoundException("Job not found");
		return this.prisma.candidate.findMany({
			where: { jobId: job.id },
			include: { score: true },
		});
	}

	async addCandidate(dto: CreateCandidateDto): Promise<GetCandidate> {
		const job = await this.prisma.job.findUnique({
			where: { uuid: dto.jobId },
		});
		if (!job) throw new NotFoundException("Job not found");
		return this.prisma.candidate.create({
			data: {
				name: dto.name,
				cvText: "",
				jobId: job.id,
			},
			include: { score: true },
		});
	}

	async getCandidate(uuid: string): Promise<GetCandidate> {
		const candidate = await this.prisma.candidate.findUnique({
			where: { uuid },
			include: { score: true },
		});
		if (!candidate) throw new NotFoundException("Candidate not found");
		return candidate;
	}

	async updateCandidate(
		uuid: string,
		dto: UpdateCandidateDto,
	): Promise<GetCandidate> {
		const candidate = await this.prisma.candidate.findUnique({
			where: { uuid },
		});
		if (!candidate) throw new NotFoundException("Candidate not found");
		return this.prisma.candidate.update({
			where: { uuid },
			data: dto,
			include: { score: true },
		});
	}

	async deleteCandidate(uuid: string): Promise<void> {
		const candidate = await this.prisma.candidate.findUnique({
			where: { uuid },
		});
		if (!candidate) throw new NotFoundException("Candidate not found");
		await this.prisma.$transaction([
			this.prisma.candidateScore.deleteMany({ where: { candidateId: candidate.id } }),
			this.prisma.candidate.delete({ where: { uuid } }),
		]);
	}

	async scoreCandidate(uuid: string): Promise<GetCandidate> {
		const candidate = await this.prisma.candidate.findUnique({
			where: { uuid },
			include: { job: true, score: true },
		});
		if (!candidate) throw new NotFoundException("Candidate not found");

		const cv = candidate.cvText || "N/A";
		const meetingNotes = candidate.appFormText || "N/A";
		const extraData = candidate.extraText || "N/A";

		const prompt = `Job description:\n${candidate.job.content}\n\nCV: ${cv}\nMeeting notes: ${meetingNotes}\nExtra candidate data: ${extraData}`;

		const raw = await this.ai.createMessage(
			[{ role: "user", content: prompt }],
			{ system: SCORING_SYSTEM_PROMPT },
		);

		let parsed: {
			overall: number;
			skillsMatch: number;
			experience: number;
			cultureFit: number;
			summary: string;
			pros: string[];
			cons: string[];
		};

		try {
			const cleaned = raw
				.replace(/^```(?:json)?\s*/i, "")
				.replace(/\s*```$/, "")
				.trim();
			parsed = JSON.parse(cleaned);
		} catch {
			throw new InternalServerErrorException(
				"Failed to parse AI scoring response",
			);
		}

		const scoreData = {
			overall: parsed.overall,
			skillsMatch: parsed.skillsMatch,
			experience: parsed.experience,
			cultureFit: parsed.cultureFit,
			summary: parsed.summary,
			pros: parsed.pros,
			cons: parsed.cons,
		};

		if (candidate.score) {
			await this.prisma.candidateScore.update({
				where: { candidateId: candidate.id },
				data: scoreData,
			});
		} else {
			await this.prisma.candidateScore.create({
				data: { ...scoreData, candidateId: candidate.id },
			});
		}

		return this.prisma.candidate.findUnique({
			where: { uuid },
			include: { score: true },
		}) as Promise<GetCandidate>;
	}
}
