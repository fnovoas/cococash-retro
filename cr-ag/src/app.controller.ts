import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Query } from '@nestjs/common';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  // Endpoint dinámico
  @Get('cobol/:program')
  runCobol(
    @Param('program') program: string,
    @Query('msg') msg?: string,
  ): Promise<string> {
    return this.appService.runCobol(program, msg);
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

  @Post('auth/login')
login(@Body() body: any) {
  return this.appService.login(body.email, body.password);
}

@Post('auth/register')
register(@Body() body: any) {
  return this.appService.register(body.email, body.password, body.name);
}}
