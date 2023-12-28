import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryController } from "./delivery.controller";
import { DeliveryEntity } from "./delivery.entity";
import { DeliveryService } from "./delivery.service";
import { AuthModule } from "src/auth/auth.module";
import { DishModule } from "src/dish/dish.module";

@Module({
    controllers: [DeliveryController],
    providers: [DeliveryService],
    imports: [
        TypeOrmModule.forFeature([DeliveryEntity]),
        AuthModule,
        DishModule
    ],
    exports: []
})
export class DeliveryModule { }
