import { Body, Controller, OnModuleInit, Post } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './auth.dto';

@Controller('auth/')
export class AuthController implements OnModuleInit {

    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService
    ) { }

    async onModuleInit() {
        this.authService.registration({
            email: this.config.get<string>('ADMIN_EMAIL'),
            password: this.config.get<string>('ADMIN_PASSWORD')
        });
    }

    @Post('login')
    login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto);
    }

    // @Post('registration')
    // registration(@Body() userDto: UserFormat) {
    //     return this.authService.registration(userDto)
    // }
}
