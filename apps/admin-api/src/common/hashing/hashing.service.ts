import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class HashingService {
  hash(value: string): Promise<string> {
    return hash(value, 12);
  }

  verify(value: string, hashedValue: string): Promise<boolean> {
    return compare(value, hashedValue);
  }
}
