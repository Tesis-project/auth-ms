import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginAuth_Dto, RegisterAuth_Dto } from './dto';

@Controller()
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @MessagePattern('auth.register.user')
    registerUser(@Payload() registerUserDto: RegisterAuth_Dto) {

        return this.authService.create_auth(registerUserDto);
    }

    @MessagePattern('auth.login.user')
    loginUser(@Payload() loginUserDto: LoginAuth_Dto) {

        return this.authService.login(loginUserDto);
    }

    @MessagePattern('auth.verify.user')
    verifyUser(@Payload() token: string) {

        return this.authService.verifyToken(token);

    }

}
