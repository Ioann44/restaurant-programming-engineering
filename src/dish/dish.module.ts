import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DishController } from "./dish.controller";
import { DishEntity } from "./dish.entity";
import { FileModule } from "src/file/file.module";
import { DishService } from "./dish.service";

@Module({
    controllers: [DishController],
    providers: [DishService],
    imports: [
        TypeOrmModule.forFeature([DishEntity]),
        FileModule
    ],
    exports: []
})
export class DishModule { }
