import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { from, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
  async generateJwt(user: User): Promise<string> {
    return await this.jwtService.signAsync({ user })
  }

  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storedPasswordHash)
  }
}
