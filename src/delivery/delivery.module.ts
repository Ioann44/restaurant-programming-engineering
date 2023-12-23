import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryController } from "./delivery.controller";
import { DeliveryEntity } from "./delivery.entity";
import { DeliveryService } from "./delivery.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [DeliveryController],
    providers: [DeliveryService],
    imports: [
        TypeOrmModule.forFeature([DeliveryEntity]),
        AuthModule
    ],
    exports: []
})
export class DeliveryModule { }
