import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class CobolService {

  private readonly logger = new Logger(CobolService.name);
  private readonly coreUrl = process.env.CORE_URL || 'http://core:3002';

  // Ejecuta un programa COBOL en el core, opcionalmente enviando un mensaje
  async run(program: string, msg?: string): Promise<string> {
    const url = msg
      ? `${this.coreUrl}/run/${program}?msg=${encodeURIComponent(msg)}`
      : `${this.coreUrl}/run/${program}`;

    this.logger.log(`Llamando a core: ${url}`);

    try {
      const res = await fetch(url);

      // Validación de respuesta HTTP
      if (!res.ok) {
        this.logger.error(`Error desde core: ${res.status}`);
        throw new Error(`Core error: ${res.status}`);
      }

      const output = await res.text();
      return output;

    } catch (error) {
      // Manejo de errores de comunicación
      this.logger.error(
        `Error de comunicación con core (${program})`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new Error('Error comunicando con core');
    }
  }

  // Obtiene la lista de programas disponibles desde el core
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