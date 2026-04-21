import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get('job/:jobUuid')
  getCandidatesByJob(@Param('jobUuid') jobUuid: string) {
    return this.candidateService.getCandidatesByJob(jobUuid);
  }

  @Post()
  addCandidate(@Body() dto: CreateCandidateDto) {
    return this.candidateService.addCandidate(dto);
  }

  @Patch(':uuid')
  updateCandidate(@Param('uuid') uuid: string, @Body() dto: UpdateCandidateDto) {
    return this.candidateService.updateCandidate(uuid, dto);
  }
}
