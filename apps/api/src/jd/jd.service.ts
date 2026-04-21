import { PrismaService } from "@lib/prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JdService {
  constructor(private readonly prisma: PrismaService) {}


  async getJobs() {
    return this.prisma.job.findMany();
  }

  // async createJob(createJobDto: CreateJobDto) {
  //   return this.prisma.job.create({
  //     data: createJobDto,
  //   });
  // }
}