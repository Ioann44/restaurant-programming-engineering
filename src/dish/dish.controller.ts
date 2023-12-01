import { Body, Controller, Get, Param, Patch, Put, Delete } from "@nestjs/common";
import { DishDto } from "./dish.dto";
import DishService from "./dish.service";

@Controller("dish/")
export class DishController {

    constructor(private readonly dishService: DishService) { }

    @Get("")
    async getAll(): Promise<DishDto[]> {
        return this.dishService.getAll();
    }

    @Put("")
    async addOne(@Body() input: DishDto): Promise<DishDto> {
        return this.dishService.insertOne(input);
    }

    @Patch()
    async update(@Body() input: DishDto): Promise<DishDto> {
        return this.dishService.update(input);
    }

    @Delete(":id")
    async deleteOne(@Param("id") id: number): Promise<number> {
        return this.dishService.deleteOne(id);
    }
}
