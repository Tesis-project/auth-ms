import { IsString, IsEmail, IsStrongPassword, MinLength } from 'class-validator';


export class RegisterAuth_Dto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    last_name: string;
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword()
    password: string;

}
