// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-local';
// import { LoginUserDto } from '../models/dtos/LoginUser.dto';
// import { AuthService } from '../services/auth.service';
// import { UserService } from '../services/user.service';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService,
//     private readonly userService: UserService) {
//     super();
//   }

//   async validate(loginUserDto: LoginUserDto): Promise<any> {
//     const user = await this.userService.login(loginUserDto);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }