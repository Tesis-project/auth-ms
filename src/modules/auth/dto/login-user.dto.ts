import { IsEmail, IsString, IsStrongPassword } from "class-validator";


export class LoginUser_Dto {

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;

}