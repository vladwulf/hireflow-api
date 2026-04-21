import { PrismaModule } from "@lib/prisma";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JdModule } from "./jd/jd.module";
import { TemplatesModule } from "./templates/templates.module";
import { StatsModule } from "./stats/stats.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		TemplatesModule,
		JdModule,
		StatsModule,
	],
})
export class AppModule {}
