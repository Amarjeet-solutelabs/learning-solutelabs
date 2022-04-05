import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  firstName: string;

  @IsEmail()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
