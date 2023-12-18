import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DishController } from "./dish.controller";
import DishService from "./dish.service";
import { DishEntity } from "./dish.entity";
import { AuthModule } from "src/auth/auth.module";
import { FileModule } from "src/file/file.module";

@Module({
    controllers: [DishController],
    providers: [DishService],
    imports: [
        TypeOrmModule.forFeature([DishEntity]),
        AuthModule,
        FileModule
    ],
    exports: []
})
export class DishModule { }
