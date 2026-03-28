import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CobolService implements OnModuleInit {

  private readonly logger = new Logger(CobolService.name);
  private readonly DEFAULT_TIMEOUT_MS =
  parseInt(process.env.COBOL_TIMEOUT_MS || '5000');

  private corePath = process.env.COCOCASH_CORE_PATH || '/app/cr-core';
  private binPath = path.join(this.corePath, 'bin');

  private availablePrograms: Set<string> = new Set();

  onModuleInit() {
    this.logger.log('Inicializando CobolService...');
    this.loadPrograms();
    this.watchPrograms();
  }

  private loadPrograms() {
    try {
      const files = fs.readdirSync(this.binPath);

      this.availablePrograms.clear();

      files.forEach(file => {
        const fullPath = path.join(this.binPath, file);

        try {
          const stat = fs.statSync(fullPath);

          if (stat.isFile() && (stat.mode & 0o111)) {
            this.availablePrograms.add(file);
          }

        } catch (err) {
          this.logger.error(
            `Error leyendo archivo ${file}`,
            err instanceof Error ? err.stack : String(err)
          );
        }
      });

      this.logger.log(`Programas COBOL detectados: ${[...this.availablePrograms].join(', ')}`);

    } catch (err) {
      this.logger.error(
        'Error leyendo directorio binPath',
        err instanceof Error ? err.stack : String(err)
      );
    }
  }

  private watchPrograms() {
    try {
      fs.watch(this.binPath, () => {
        this.logger.warn('Cambio detectado en bin/, recargando programas...');
        this.loadPrograms();
      });

      this.logger.log('Watcher configurado en binPath');

    } catch (err) {
      this.logger.error(
        'Error configurando watcher en binPath',
        err instanceof Error ? err.stack : String(err)
      );
    }
  }

  getPrograms(): string[] {
    this.logger.debug('Listado de programas solicitado');
    return [...this.availablePrograms];
  }

  async run(program: string): Promise<string> {

    this.logger.log(`Ejecutando programa: ${program}`);

    // Validación de nombre
    if (!/^[a-zA-Z0-9_-]+$/.test(program)) {
      this.logger.warn(`Nombre de programa inválido: ${program}`);
      throw new Error('Nombre de programa inválido');
    }

    if (!this.availablePrograms.has(program)) {
      this.logger.warn(`Programa no encontrado: ${program}`);
      throw new Error(`Programa no encontrado: ${program}`);
    }

    const resolvedPath = path.resolve(this.binPath, program);

    // Validación de seguridad (evitar path traversal)
    if (!resolvedPath.startsWith(path.resolve(this.binPath))) {
      this.logger.error(`Intento de acceso no permitido: ${resolvedPath}`);
      throw new Error('Acceso no permitido');
    }

return new Promise((resolve, reject) => {

  const child = spawn(resolvedPath);

  let stdout = '';
  let stderr = '';
  let finished = false;

  // ⏱ Timeout
  const timeout = setTimeout(() => {
    if (!finished) {
      this.logger.error(`Timeout ejecutando ${program}, matando proceso...`);
      child.kill('SIGKILL');
      finished = true;
      reject(new Error(`Timeout ejecutando programa: ${program}`));
    }
  }, this.DEFAULT_TIMEOUT_MS);

  child.stdout.on('data', (data) => {
    const chunk = data.toString();
    stdout += chunk;
    this.logger.debug(`STDOUT (${program}): ${chunk}`);
  });

  child.stderr.on('data', (data) => {
    const chunk = data.toString();
    stderr += chunk;
    this.logger.error(`STDERR (${program}): ${chunk}`);
  });

  child.on('close', (code) => {
    if (finished) return;

    finished = true;
    clearTimeout(timeout);

    if (code !== 0) {
      this.logger.error(`Programa ${program} terminó con código ${code}`);
      return reject(
        new Error(`COBOL error (${code}): ${stderr}`)
      );
    }

    this.logger.log(`Programa ${program} ejecutado correctamente`);
    resolve(stdout);
  });

  child.on('error', (err) => {
    if (finished) return;

    finished = true;
    clearTimeout(timeout);

    this.logger.error(
      `Error ejecutando programa ${program}`,
      err instanceof Error ? err.stack : String(err)
    );
    reject(err);
  });
});}}
