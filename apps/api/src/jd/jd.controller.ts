import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { CreateJobDto } from "./dto/create-job.dto";
import { RegenerateJobDto } from "./dto/regenerate-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JdService } from "./jd.service";

@Controller("jobs")
export class JdController {
	constructor(private readonly jdService: JdService) {}

	@Get()
	getJobs() {
		return this.jdService.getJobs();
	}

	@Get(":uuid")
	getJob(@Param("uuid") uuid: string) {
		return this.jdService.getJob(uuid);
	}

	@Patch(":uuid/status")
	updateJobStatus(@Param("uuid") uuid: string) {
		return this.jdService.updateJobStatus(uuid);
	}

	@Delete(":uuid")
	@HttpCode(204)
	deleteJob(@Param("uuid") uuid: string) {
		return this.jdService.deleteJob(uuid);
	}

	@Patch(":uuid")
	updateJob(@Param("uuid") uuid: string, @Body() dto: UpdateJobDto) {
		return this.jdService.updateJob(uuid, dto);
	}

	@Post(":uuid/regenerate")
	regenerateJob(@Param("uuid") uuid: string, @Body() dto: RegenerateJobDto) {
		return this.jdService.regenerateJob(uuid, dto);
	}

	@Post()
	createJob(@Body() dto: CreateJobDto) {
		return this.jdService.createJob(dto);
	}
}
