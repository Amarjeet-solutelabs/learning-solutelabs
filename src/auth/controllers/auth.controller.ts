// import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { UpdateUserDto } from '../models/dtos/update-user.dto';
// import { User } from '../models/user.interface';
// import { AuthService } from '../services/auth.service';
// import { UserService } from '../services/user.service';
// @Controller('auth')
// export class AuthController {
//     constructor(
//         private usersService: UserService,
//         private authService:AuthService){}

//     @Post('register')
//     register(@Body() user:User):Observable<User>
//     {
//         return this.authService.registerAccount(user)
//     }

//     @Post('login')
//     login(@Body() user:User):Observable<{token:string}> {
//         return this.authService
//         .login(user)
//         .pipe(map((jwt:string)=> ({token:jwt})))
//     }

//     @Patch('/:id')
//   updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
//     return this.usersService.update(parseInt(id), body);
//   }
// }
