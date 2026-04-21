import { PrismaService } from "@lib/prisma";
import { Injectable } from "@nestjs/common";
import { GetStats } from "./types";

@Injectable()
export class StatsService {
	constructor(private readonly prisma: PrismaService) {}

	async getStats(): Promise<GetStats> {
		const [activeJobs, templates, candidates, scores, recentJobs] =
			await Promise.all([
				this.prisma.job.count({ where: { status: "ACTIVE" } }),
				this.prisma.template.count(),
				this.prisma.candidate.count(),
				this.prisma.candidateScore.aggregate({ _avg: { overall: true } }),
				this.prisma.job.findMany({
					take: 5,
					orderBy: { createdAt: "desc" },
					include: { _count: { select: { candidates: true } } },
				}),
			]);

		return {
			activeJobs,
			templates,
			candidates,
			avgScore: scores._avg.overall ? Math.round(scores._avg.overall) : null,
			recentJobs: recentJobs.map((job) => ({
        uuid: job.uuid,
				title: job.title,
				category: job.category,
				status: job.status,
				createdAt: job.createdAt.toISOString(),
				candidateCount: job._count.candidates,
			})),
		};
	}
}
