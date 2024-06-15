import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginUser_Dto, RegisterUser_Dto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @MessagePattern('auth.register.user')
    registerUser(@Payload() registerUserDto: RegisterUser_Dto) {

        return this.authService.registerUser(registerUserDto);
    }

    @MessagePattern('auth.login.user')
    loginUser(@Payload() loginUserDto: LoginUser_Dto) {

        return this.authService.login(loginUserDto);
    }

    @MessagePattern('auth.verify.user')
    verifyUser(@Payload() token: string) {

        return this.authService.verifyToken(token);

    }

}
