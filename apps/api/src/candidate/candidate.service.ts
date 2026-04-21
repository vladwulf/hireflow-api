import { PrismaService } from '@lib/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { GetCandidate } from './types';

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  async getCandidatesByJob(jobUuid: string): Promise<GetCandidate[]> {
    const job = await this.prisma.job.findUnique({ where: { uuid: jobUuid } });
    if (!job) throw new NotFoundException('Job not found');
    return this.prisma.candidate.findMany({ where: { jobId: job.id } });
  }

  async addCandidate(dto: CreateCandidateDto): Promise<GetCandidate> {
    const job = await this.prisma.job.findUnique({ where: { uuid: dto.jobId } });
    if (!job) throw new NotFoundException('Job not found');
    return this.prisma.candidate.create({
      data: {
        name: dto.name,
        cvText: '',
        jobId: job.id,
      },
    });
  }

  async updateCandidate(uuid: string, dto: UpdateCandidateDto): Promise<GetCandidate> {
    const candidate = await this.prisma.candidate.findUnique({ where: { uuid } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return this.prisma.candidate.update({
      where: { uuid },
      data: dto,
    });
  }
}
