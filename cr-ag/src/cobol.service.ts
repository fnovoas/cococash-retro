import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class CobolService {

  private readonly logger = new Logger(CobolService.name);
  private readonly coreUrl = process.env.CORE_URL || 'http://core:3002';

  async run(program: string): Promise<string> {
    this.logger.log(`Llamando a core para ejecutar: ${program}`);

    try {
      const res = await fetch(`${this.coreUrl}/run/${program}`);

      if (!res.ok) {
        this.logger.error(`Error desde core: ${res.status}`);
        throw new Error(`Core error: ${res.status}`);
      }

      const output = await res.text();
      return output;

    } catch (error) {
      this.logger.error(
        `Error de comunicación con core (${program})`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new Error('Error comunicando con core');
    }
  }

  async getPrograms(): Promise<string[]> {
    this.logger.log('Solicitando lista de programas al core');

    try {
      const res = await fetch(`${this.coreUrl}/programs`);

      if (!res.ok) {
        this.logger.error(`Error obteniendo programas: ${res.status}`);
        throw new Error(`Core error: ${res.status}`);
      }

      const programs = await res.json() as string[];
      return programs;

    } catch (error) {
      this.logger.error(
        'Error de comunicación obteniendo programas',
        error instanceof Error ? error.stack : String(error),
      );
      throw new Error('Error comunicando con core');
    }
  }
}