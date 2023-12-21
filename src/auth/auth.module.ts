import { Module } from "@nestjs/common";
import { ClientsAuthController, StaffAuthController } from "./auth.controller";
import { StaffAuthService } from "./auth-staff.service";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientEntity, StaffEntity } from "./auth.entity";
import { ClientAuthService } from "./auth-client.service";
import { TokenParser } from "./jwt-auth.guard";

@Module({
    controllers: [StaffAuthController, ClientsAuthController],
    providers: [StaffAuthService, ClientAuthService, TokenParser],
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "SECRET",
            signOptions: {
                expiresIn: "24h"
            }
        }),
        TypeOrmModule.forFeature([ClientEntity, StaffEntity]),
    ],
    exports: [
        StaffAuthService,
        ClientAuthService,
        JwtModule,
        TokenParser
    ]
})
export class AuthModule { }
