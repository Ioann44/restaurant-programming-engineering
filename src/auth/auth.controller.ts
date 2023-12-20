import { Body, Controller, Delete, Get, OnModuleInit, Param, Patch, Post, Put, UseGuards, Request } from "@nestjs/common";
import { StaffAuthService, Roles, RolesEnum, ClientAuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ClientDto, StaffDto, jwtPayloadDto } from "./auth.dto";

@Controller("auth/admin")
export class StaffAuthController implements OnModuleInit {
    constructor(
        private readonly staffService: StaffAuthService,
        private readonly config: ConfigService
    ) { }

    async onModuleInit() {
        if ((await this.staffService.getAll()).length == 0) {
            this.staffService.register({
                id: 0,
                email: this.config.get<string>("ADMIN_EMAIL"),
                password: this.config.get<string>("ADMIN_PASSWORD"),
                role: RolesEnum.Admin,
            });
        }
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Put("")
    async registerStaff(@Body() input: StaffDto): Promise<Object> {
        return this.staffService.register(input);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Get("")
    async getStaff(): Promise<Object[]> {
        return (await this.staffService.getAll()).map(val => { const { password, ...other } = { ...val }; return other });
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Patch("")
    async updateStaff(@Body() input: StaffDto): Promise<Object> {
        const { password, ...other } = { ...await this.staffService.update(input) };
        return other;
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Delete("/:id")
    async deleteStaff(@Param("id") id: number): Promise<number> {
        return this.staffService.delete(id);
    }
}

@Controller("auth")
export class ClientsAuthController {
    constructor(
        private readonly clientService: ClientAuthService,
    ) { }

    @Post("")
    async login(@Body() input: ClientDto): Promise<Object> {
        return this.clientService.login(input);
    }

    @Put("")
    async register(@Body() input: ClientDto): Promise<Object> {
        return this.clientService.register(input);
    }

    @Roles(RolesEnum.Client)
    @UseGuards(JwtAuthGuard)
    @Patch("")
    async updateStaff(@Body() input: ClientDto, @Request() req: jwtPayloadDto): Promise<Object> {
        console.log(req);
        input.id = req.id;
        const { password, ...other } = { ...await this.clientService.update(input) };
        return other;
    }
}