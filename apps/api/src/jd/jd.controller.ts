import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { JdService } from "./jd.service";

@Controller('jobs')
export class JdController {
  constructor(private readonly jdService: JdService) {}

  @Get()
  getJobs() {
    return this.jdService.getJobs();
  }

  @Post()
  createJob(@Body() dto: CreateJobDto) {
    return this.jdService.createJob(dto);
  }
}
