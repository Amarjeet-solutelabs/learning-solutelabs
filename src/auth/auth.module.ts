// import { UserEntity } from './models/user.entity';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthService } from './services/auth.service';
// import { JwtGuard } from './guards/jwt.guard';
// import { JwtStrategy } from './guards/jwt.strategy';
// import { UserService } from './services/user.service';
// import { UserModule } from './user.module';
// import { UserController } from './controllers/user.controller';

// @Module({
//   imports:[ 
//     JwtModule.registerAsync({
//     useFactory:() => ({
//       secret:process.env.JWT_SECRET,
//       signOptions: { expiresIn: '3600s' },
//     })
//   }),
//   TypeOrmModule.forFeature([UserEntity]),
//   UserModule,
//   ],
//   providers: [AuthService,JwtGuard,JwtStrategy, UserService],
//   controllers: [ UserController],
//   exports: [AuthService,UserService],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '10000s'}
      })
    })
  ],
  providers: [AuthService, JwtStrategy, JwtGuard],
  exports: [AuthService]
})
export class AuthModule {}