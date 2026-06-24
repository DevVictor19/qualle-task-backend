import { Injectable } from '@nestjs/common';
import { HashService } from '../../application';
import { hash, compare } from 'bcrypt';

@Injectable()
export class HashServiceImpl implements HashService {
  async hash(value: string, salt?: number): Promise<string> {
    const saltRounds = salt || 10;
    return hash(value, saltRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }
}
