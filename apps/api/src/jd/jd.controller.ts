import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JdService } from "./jd.service";

@Controller("jobs")
export class JdController {
	constructor(private readonly jdService: JdService) {}

	@Get()
	getJobs() {
		return this.jdService.getJobs();
	}

	@Get(":id")
	getJob(@Param("id") id: string) {
		return this.jdService.getJob(id);
	}

	@Patch(":uuid/status")
	updateJobStatus(@Param("uuid") uuid: string) {
		return this.jdService.updateJobStatus(uuid);
	}

	@Delete(":id")
	@HttpCode(204)
	deleteJob(@Param("id") id: number) {
		return this.jdService.deleteJob(id);
	}

	@Patch(":id")
	updateJob(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateJobDto) {
		return this.jdService.updateJob(id, dto);
	}

	@Post()
	createJob(@Body() dto: CreateJobDto) {
		return this.jdService.createJob(dto);
	}
}
