import { Injectable } from '@nestjs/common';
import { CobolService } from './cobol.service';

@Injectable()
export class AppService {

  constructor(private readonly cobolService: CobolService) {}

  runCobol(program: string, msg?: string): Promise<string> {
    return this.cobolService.run(program, msg);
  }

  async getPrograms(): Promise<string[]>{
    return this.cobolService.getPrograms();
  }
}