import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CobolService } from './cobol.service';

@Injectable()
export class AppService {

  constructor(private readonly cobolService: CobolService) {}

  private AUTH_URL = 'http://auth-ms:4000';

  runCobol(program: string, msg?: string): Promise<string> {
    return this.cobolService.run(program, msg);
  }

  async getPrograms(): Promise<string[]> {
    return this.cobolService.getPrograms();
  }

  // ======================
  // AUTH METHODS
  // ======================

  async login(email: string, password: string) {
    const res = await fetch(`${this.AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    let data: any;

    try {
      data = await res.json();
    } catch (e) {
      console.error("LOGIN PARSE ERROR");
      throw new HttpException("Invalid response from auth service", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      throw new HttpException(
        data?.detail || "Login failed",
        res.status || HttpStatus.BAD_REQUEST
      );
    }

    return data;
  }

  async register(email: string, password: string, name: string) {
  const res = await fetch(`${this.AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name })
  });

  const text = await res.text();

  console.log("RAW REGISTER RESPONSE:", text);

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      throw new HttpException(
        data?.detail || "Register failed",
        res.status || HttpStatus.BAD_REQUEST
      );
    }

    return data;

  } catch (e) {
    console.error("REGISTER NOT JSON:", text);

    throw new HttpException(
      "Auth service returned invalid response",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}}