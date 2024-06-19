import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    last_name: string;

    @IsString()
    // @IsUUID(4)
    auth: string;

}
