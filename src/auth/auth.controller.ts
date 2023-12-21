import { Body, Controller, Delete, Get, OnModuleInit, Param, Patch, Post, Put, UseGuards, Request } from "@nestjs/common";
import { StaffAuthService } from "./auth-staff.service";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard, Roles, TokenParser } from "./jwt-auth.guard";
import { ClientDto, RolesEnum, StaffDto, UserReturnedDto, JwtPayloadDto } from "./auth.dto";
import { ClientAuthService } from "./auth-client.service";

@Controller("auth/staff")
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

    @Post("")
    async login(@Body() input): Promise<UserReturnedDto> {
        return this.staffService.login(input);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Put("")
    async registerStaff(@Body() input: StaffDto): Promise<UserReturnedDto> {
        return this.staffService.register(input);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Get("")
    async getStaff(): Promise<StaffDto[]> {
        return (await this.staffService.getAll()).map(val => { const { password, ...other } = { ...val }; return other }) as any;
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Patch("")
    async updateStaff(@Body() input: StaffDto): Promise<StaffDto> {
        const { password, ...other } = { ...await this.staffService.update(input) };
        return other as any;
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
        private readonly tokenParser: TokenParser
    ) { }

    @Post("")
    async login(@Body() input: ClientDto): Promise<UserReturnedDto> {
        return this.clientService.login(input);
    }

    @Put("")
    async register(@Body() input: ClientDto): Promise<UserReturnedDto> {
        return this.clientService.register(input);
    }

    @Roles(RolesEnum.Client)
    @UseGuards(JwtAuthGuard)
    @Patch("")
    async updateClient(@Body() input: ClientDto, @Request() req): Promise<ClientDto> {
        input.id = (await this.tokenParser.parse(req)).id;
        const { password, ...other } = { ...await this.clientService.update(input) };
        return other as any;
    }
}