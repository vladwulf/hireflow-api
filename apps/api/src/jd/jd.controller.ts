import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { JdService } from "./jd.service";



@Controller('jobs')
export class JdController {
  constructor(private readonly jdService: JdService) {}

  @Get()
  getJobs() {
    return this.jdService.getJobs();
  }

  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jdService.getJob(id);
  }

  @Post()
  createJob(@Body() dto: CreateJobDto) {
    return this.jdService.createJob(dto);
  }
}
