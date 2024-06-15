import { IsString, IsEmail, IsStrongPassword } from "class-validator";


export class RegisterUser_Dto {

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;


}
