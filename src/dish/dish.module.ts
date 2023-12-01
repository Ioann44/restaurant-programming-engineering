import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishController } from './dish.controller';
import DishService from './dish.service';
import { DishEntity } from './dish.entity';

@Module({
    controllers: [DishController],
    providers: [DishService],
    imports: [TypeOrmModule.forFeature([DishEntity])],
    exports: []
})
export class DishModule { }
