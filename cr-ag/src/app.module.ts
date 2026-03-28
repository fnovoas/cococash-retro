import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CobolService } from './cobol.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CobolService],
})
export class AppModule {}
