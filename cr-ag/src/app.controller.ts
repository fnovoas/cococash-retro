import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  // Endpoint dinámico
  @Get('cobol/:program')
  runCobol(@Param('program') program: string): Promise<string> {
    return this.appService.runCobol(program);
  }

  // Endpoint de prueba opcional (retrocompatibilidad)
  @Get()
  getHola(): Promise<string> {
    return this.appService.runCobol('hola');
  }

  @Get('cobol')
  async getPrograms(): Promise<string[]> {
    return this.appService.getPrograms();
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

