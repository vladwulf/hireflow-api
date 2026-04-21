import { PrismaService } from "@lib/prisma";
import { Injectable } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { GetJob } from "./types";

@Injectable()
export class JdService {
  constructor(private readonly prisma: PrismaService) {}

  async getJobs(): Promise<GetJob[]> {
    return this.prisma.job.findMany();
  }

  async createJob(createJobDto: CreateJobDto): Promise<GetJob> {
    return this.prisma.job.create({
      data: createJobDto,
    });
  }
}
