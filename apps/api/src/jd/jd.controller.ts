import { Controller, Get, Post } from "@nestjs/common";
import { JdService } from "./jd.service";

@Controller('jobs')
export class JdController {
  constructor(private readonly jdService: JdService) {}

  @Get()
  getJobs() {
    return this.jdService.getJobs();
  }

  // @Post()
  // createJob(@Body() createJobDto: CreateJobDto) {
  //   return this.jdService.createJob(createJobDto);
  // }
}