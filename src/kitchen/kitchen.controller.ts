import { Controller, Get, Param, UseGuards, Put, Body, Patch, Delete } from "@nestjs/common";
import { RolesEnum } from "src/auth/auth.dto";
import { Roles, JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { KitchenDto } from "./kitchen.dto";
import { KitchenService } from "./kitchen.service";

@Controller("kitchen/")
export class KitchenController {
    constructor(
        private readonly kitchenService: KitchenService
    ) { }

    @Get("")
    async getAll(): Promise<KitchenDto[]> {
        return this.kitchenService.getAll();
    }

    @Get("one/:id")
    async getOne(@Param("id") id: number): Promise<KitchenDto> {
        return this.kitchenService.getOne(id);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Put("")
    async create(@Body() input: KitchenDto): Promise<KitchenDto> {
        return this.kitchenService.insertOne(input);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Patch()
    async update(@Body() input): Promise<KitchenDto> {
        return this.kitchenService.update(input);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteOne(@Param("id") id: number): Promise<number> {
        return this.kitchenService.deleteOne(id);
    }
}