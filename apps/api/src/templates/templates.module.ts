import { AiModule } from "@lib/ai";
import { Module } from "@nestjs/common";
import { TemplatesController } from "./templates.controller";
import { TemplatesService } from "./templates.service";

@Module({
	imports: [AiModule],
	controllers: [TemplatesController],
	providers: [TemplatesService],
})
export class TemplatesModule {}
