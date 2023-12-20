import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryController } from "./delivery.controller";
import { DeliveryEntity } from "./delivery.entity";
import { DeliveryService } from "./delivery.service";

@Module({
    controllers: [DeliveryController],
    providers: [DeliveryService],
    imports: [
        TypeOrmModule.forFeature([DeliveryEntity]),
    ],
    exports: []
})
export class DeliveryModule { }
