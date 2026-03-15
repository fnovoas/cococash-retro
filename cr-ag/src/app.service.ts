import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';

@Injectable()
export class AppService {
  getHola(): Promise<string> {
    return new Promise((resolve, reject) => {
      execFile(
        "/app/cr-core/hola",
        (error, stdout) => {
          if (error) {
            reject(error);
          }
          resolve(stdout);
        }
      );
    });
  }
}
