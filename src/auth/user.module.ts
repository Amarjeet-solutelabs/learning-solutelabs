import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from './models/user.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([UserEntity]),
      AuthModule
    ],
    providers: [UserService],
    controllers: [UserController]
  })
export class UserModule {}
