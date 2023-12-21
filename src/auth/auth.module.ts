import { Module } from "@nestjs/common";
import { StaffAuthController } from "./auth.controller";
import { StaffAuthService } from "./auth-staff.service";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientEntity, StaffEntity } from "./auth.entity";
import { ClientAuthService } from "./auth-client.service";

@Module({
    controllers: [StaffAuthController],
    providers: [StaffAuthService, ClientAuthService],
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
        JwtModule
    ]
})
export class AuthModule { }
