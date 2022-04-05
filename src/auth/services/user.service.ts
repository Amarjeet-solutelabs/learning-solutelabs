import { map, switchMap } from 'rxjs/operators';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../models/dtos/CreateUser.dto';
import { LoginUserDto } from '../models/dtos/LoginUser.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) { }

  create(createdUserDto: CreateUserDto): Observable<User> {
    const userEntity = this.userRepository.create(createdUserDto);

    return this.mailExists(userEntity.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.authService.hashPassword(userEntity.password).pipe(
            switchMap((passwordHash: string) => {
              // Overwrite the user password with the hash, to store it in the db
              userEntity.password = passwordHash;
              return from(this.userRepository.save(userEntity)).pipe(
                map((savedUser: User) => {
                  const { password, ...user } = savedUser;
                  return user;
                })
              )
            })
          )
        } else {
          throw new HttpException('Email already in use', HttpStatus.CONFLICT);
        }
      })
    )
  }

  login(loginUserDto: LoginUserDto) {
    return this.findUserByEmail(loginUserDto.email.toLowerCase()).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.validatePassword(loginUserDto.password, user.password).pipe(
            switchMap((passwordsMatches) => {
              if (passwordsMatches) {
                return this.findOne(user.id).pipe(
                  switchMap((user: User) => this.authService.generateJwt(user))
                )
              } else {
                throw new HttpException('Login was not Successfulll', HttpStatus.UNAUTHORIZED);
              }
            })
          )
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }
      )
    )
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne(id));
  }

   findUserByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email }, { select: ['id', 'email', 'firstName', 'password','lastName','role'] }));
  }


  private validatePassword(password: string, storedPasswordHash: string): Observable<User> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private mailExists(email: string): Observable<boolean> {
    email = email.toLowerCase();
    return from(this.userRepository.findOne({ email })).pipe(
      map((user: User) => {
        if (user) {
          return true;
        } else {
          return false;
        }
      })
    )
  }

}