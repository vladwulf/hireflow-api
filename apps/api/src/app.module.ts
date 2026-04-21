import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplatesModule } from './templates/templates.module';
import { JdModule } from './jd/jd.module';

@Module({
  imports: [TemplatesModule, JdModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
