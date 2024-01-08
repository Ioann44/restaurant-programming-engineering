import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DishController } from "./dish.controller";
import { DishEntity } from "./dish.entity";
import { FileModule } from "src/file/file.module";
import { DishService } from "./dish.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [DishController],
    providers: [DishService],
    imports: [
        TypeOrmModule.forFeature([DishEntity]),
        FileModule,
        forwardRef(() => AuthModule)
    ],
    exports: [DishService]
})
export class DishModule { }
