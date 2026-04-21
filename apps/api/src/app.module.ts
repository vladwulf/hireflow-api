import { PrismaModule } from "@lib/prisma";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CandidateModule } from "./candidate/candidate.module";
import { HealthModule } from "./health/health.module";
import { JdModule } from "./jd/jd.module";
import { StatsModule } from "./stats/stats.module";
import { TemplatesModule } from "./templates/templates.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		HealthModule,
		TemplatesModule,
		JdModule,
		CandidateModule,
		StatsModule,
	],
})
export class AppModule {}
