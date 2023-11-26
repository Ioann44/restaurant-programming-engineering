import { Body, Controller, OnModuleInit, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { UserFormat } from "../users/users.dto";
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController implements OnModuleInit {

    constructor(private authService: AuthService, private config: ConfigService) {}

    async onModuleInit() {
        this.authService.registration({
            email: this.config.get<string>('ADMIN_EMAIL'),
            password: this.config.get<string>('ADMIN_PASSWORD')
        });
    }

    @Post('/login')
    login(@Body() userDto: UserFormat) {
        return this.authService.login(userDto)
    }

    // @Post('/registration')
    // registration(@Body() userDto: UserFormat) {
    //     return this.authService.registration(userDto)
    // }
}
