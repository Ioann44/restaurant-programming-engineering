import { Body, Controller, Get, Param, Patch, Put, Delete, UseGuards } from "@nestjs/common";
import { DishDto } from "./dish.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import DishService from "./dish.service";
import { Roles, RolesEnum } from "src/auth/auth.service";

@Controller("dish/")
export class DishController {
    constructor(private readonly dishService: DishService) { }

    @Get("")
    async getAll(): Promise<DishDto[]> {
        return this.dishService.getAll();
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Put("")
    async addOne(@Body() input: DishDto): Promise<DishDto> {
        return this.dishService.insertOne(input);
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Patch()
    async update(@Body() input: DishDto): Promise<DishDto> {
        return this.dishService.update(input);
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteOne(@Param("id") id: number): Promise<number> {
        return this.dishService.deleteOne(id);
    }
}