import { Module } from "@nestjs/common";
import { StaffAuthController } from "./auth.controller";
import { ClientAuthService, StaffAuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientEntity } from "./auth.entity";

@Module({
    controllers: [StaffAuthController],
    providers: [StaffAuthService],
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || "SECRET",
            signOptions: {
                expiresIn: "24h"
            }
        }),
        TypeOrmModule.forFeature([ClientEntity]),
    ],
    exports: [
        StaffAuthService,
        ClientAuthService,
        JwtModule
    ]
})
export class AuthModule { }
