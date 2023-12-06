import { Body, Controller, Delete, Get, OnModuleInit, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { AuthService, Roles, RolesEnum } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { AuthDto } from "./auth.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth/")
export class AuthController implements OnModuleInit {
    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService
    ) { }

    async onModuleInit() {
        if ((await this.authService.getAll()).length == 0) {
            this.authService.register({
                id: 0,
                email: this.config.get<string>("ADMIN_EMAIL"),
                password: this.config.get<string>("ADMIN_PASSWORD"),
                role: RolesEnum.admin,
                address: null,
                phone: null,
                fullName: null
            });
        }
    }

    @Post("")
    async login(@Body() authDto: AuthDto): Promise<Object> {
        return this.authService.login(authDto);
    }

    @Put("")
    async register(@Body() userDto: AuthDto): Promise<Object> {
        return this.authService.register({ ...userDto, role: RolesEnum.client });
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Put("admin")
    async registerStaff(@Body() userDto: AuthDto): Promise<Object> {
        return this.authService.register(userDto);
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Get("admin")
    async getStaff(): Promise<Object[]> {
        return (await this.authService.getAll()).map(val => { const { password, ...other } = { ...val }; return other });
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Patch("admin")
    async updateStaff(@Body() userDto: AuthDto): Promise<Object> {
        const { password, ...other } = { ...await this.authService.update(userDto) };
        return other;
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Delete("admin/:id")
    async deleteStaff(@Param("id") id: number): Promise<number> {
        return this.authService.delete(id);
    }
}
