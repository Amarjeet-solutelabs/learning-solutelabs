import { IsString } from "class-validator";
import { Role } from "../role.enum";
import { LoginUserDto } from "./LoginUser.dto";


export class CreateUserDto extends LoginUserDto {

    @IsString()
    firstName:string;
    
    @IsString()
    lastName:string;

    @IsString()
    role:Role;
}