import { AiModule } from "@lib/ai";
import { Module } from "@nestjs/common";
import { CandidateController } from "./candidate.controller";
import { CandidateService } from "./candidate.service";

@Module({
	imports: [AiModule],
	controllers: [CandidateController],
	providers: [CandidateService],
})
export class CandidateModule {}
