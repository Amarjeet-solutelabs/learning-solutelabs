import { LoginUserDto } from './../models/dtos/LoginUser.dto';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../models/dtos/CreateUser.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) { }

  

   async create(createdUserDto: CreateUserDto): Promise<any> {
     const mailExist = await this.mailExists(createdUserDto.email);
     if (!mailExist) {
      const userEntity = await this.userRepository.create(createdUserDto);
      const passwordHashed = await this.authService.hashPassword(userEntity.password)
      userEntity.password = passwordHashed;
      const savedUser = await this.userRepository.save(userEntity)
      const {password, ...user} = savedUser
      return user
    }
    else {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
  }

  async login(loginUserDto:LoginUserDto){
    const user = await this.findUserByEmail(loginUserDto.email.toLowerCase())

    if(user){
      const passwordsMatches = await this.validatePassword(loginUserDto.password, user.password)
      if(passwordsMatches){
        const findeduser = await this.findOne(user.id)
        return await this.authService.generateJwt(findeduser)
      }
    } else{
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne(id)
  }

   async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email }, { select: ['id', 'email', 'firstName', 'password','lastName','role'] });
    return user
  }

  async update(user:Partial<User>, attrs: Partial<User>) {
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }


  private validatePassword(password: string, storedPasswordHash: string): Promise<User> {
    return  this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async mailExists(email: string): Promise<boolean> {
    email = email.toLowerCase();
    const user = await this.userRepository.findOne({ email })
        if (user) {
          return true;
        } else {
          return false;
        }
  }

}