import { PrismaModule } from "@lib/prisma";
import { Module } from "@nestjs/common";
import { JdModule } from "./jd/jd.module";
import { TemplatesModule } from "./templates/templates.module";

@Module({
	imports: [PrismaModule, TemplatesModule, JdModule],
})
export class AppModule {}
