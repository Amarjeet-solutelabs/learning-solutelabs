import { JwtGuard } from '../guards/jwt-auth.guard';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  Param,
  NotFoundException,
  Patch,
  Request,
} from '@nestjs/common';
import { LoginUserDto } from '../models/dtos/LoginUser.dto';
import { CreateUserDto } from '../models/dtos/CreateUser.dto';
import { UserService } from '../services/user.service';
import { User } from '../models/user.interface';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { UpdateUserDto } from '../models/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Rest Call: POST http://localhost:8080/api/users/
  @Post('register')
  create(@Body() createdUserDto: CreateUserDto): Observable<User> {
    return this.userService.create(createdUserDto);
  }

  // Rest Call: POST http://localhost:8080/api/users/login

  @UseGuards(LocalAuthGuard)
  @Post('login2')
  async login2(@Request() req) {
    console.log(req.user);
    return this.userService.login(req.user);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserDto): Observable<Object> {
    return this.userService.login(loginUserDto).pipe(
      map((jwt: string) => {
        return {
          access_token: jwt,
          token_type: 'JWT',
          signOptions: { expiresIn: '1000s' },
        };
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    id = +id;
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @UseGuards(JwtGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Get('all-users')
  findAll(@Req() request): Observable<User[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtGuard)
  @Patch()
  updateUser(@Request() req,@Body() updateUserDto: UpdateUserDto) {
    const user = req.user
    return this.userService.update(user,updateUserDto)
  }
}
