import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KitchenController } from "./kitchen.controller";
import { KitchenEntity } from "./kitchen.entity";
import { KitchenService } from "./kitchen.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [KitchenController],
    providers: [KitchenService],
    imports: [
        TypeOrmModule.forFeature([KitchenEntity]),
        AuthModule
    ],
    exports: [KitchenService]
})
export class KitchenModule { }
