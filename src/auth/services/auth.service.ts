import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { from, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }
  generateJwt(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Observable<any> {
    return from(bcrypt.compare(password, storedPasswordHash))
  }
}
