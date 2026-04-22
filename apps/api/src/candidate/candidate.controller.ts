import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CandidateService } from "./candidate.service";
import { CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateDto } from "./dto/update-candidate.dto";

@Controller("candidates")
export class CandidateController {
	constructor(private readonly candidateService: CandidateService) {}

	@Get("job/:jobUuid")
	getCandidatesByJob(@Param("jobUuid") jobUuid: string) {
		return this.candidateService.getCandidatesByJob(jobUuid);
	}

	@Get(":uuid")
	getCandidate(@Param("uuid") uuid: string) {
		return this.candidateService.getCandidate(uuid);
	}

	@Post()
	addCandidate(@Body() dto: CreateCandidateDto) {
		return this.candidateService.addCandidate(dto);
	}

	@Post(":uuid/score")
	scoreCandidate(@Param("uuid") uuid: string) {
		return this.candidateService.scoreCandidate(uuid);
	}

	@Patch(":uuid")
	updateCandidate(
		@Param("uuid") uuid: string,
		@Body() dto: UpdateCandidateDto,
	) {
		return this.candidateService.updateCandidate(uuid, dto);
	}

	@Delete(":uuid")
	@HttpCode(204)
	deleteCandidate(@Param("uuid") uuid: string) {
		return this.candidateService.deleteCandidate(uuid);
	}
}
