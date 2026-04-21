import { AiModule } from "@lib/ai";
import { Module } from "@nestjs/common";
import { JdController } from "./jd.controller";
import { JdService } from "./jd.service";

@Module({
	imports: [AiModule],
	controllers: [JdController],
	providers: [JdService],
})
export class JdModule {}
