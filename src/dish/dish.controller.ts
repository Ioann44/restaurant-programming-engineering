import { Body, Controller, Get, Param, Patch, Put, Delete, UseGuards, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { DishDto } from "./dish.dto";
import { JwtAuthGuard, Roles } from "src/auth/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { plainToInstance } from "class-transformer";
import { FileService } from "src/file/file.service";
import { DishService } from "./dish.service";
import { RolesEnum } from "src/auth/auth.dto";

@Controller("dish/")
export class DishController {
    constructor(
        private readonly dishService: DishService,
        private readonly fileService: FileService
    ) { }

    @Get("")
    async getAll(): Promise<DishDto[]> {
        return (await this.dishService.getAll()).map(
            item => {
                return { ...item, image: item.image ? item.image.key : "" };
            });
    }

    @Get("one/:id")
    async getOne(@Param("id") id: number): Promise<DishDto> {
        const dish = await this.dishService.getOne(id);
        return { ...dish, image: dish.image ? dish.image.key : "" };
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("image"))
    @Put("")
    async create(@Body() inputInData, @UploadedFiles() images: Express.Multer.File[]): Promise<DishDto> {
        const input: DishDto = plainToInstance(DishDto, JSON.parse(inputInData.data));

        const isFileLoaded = images.length != 0;
        if (isFileLoaded) {
            var loadedImage = await this.fileService.createFile(images[0]);
        }
        var savedId = 0;

        try {
            if (isFileLoaded) {
                savedId = (await this.dishService.insertOne({ ...input, image: loadedImage })).id;
            } else {
                savedId = (await this.dishService.insertOne({ ...input, image: null })).id;
            }
        } catch (error) {
            if (isFileLoaded) {
                this.fileService.removeFile(loadedImage.id);
            }
            return error;
        }

        return this.getOne(savedId);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("image"))
    @Patch()
    async update(@Body() inputInData, @UploadedFiles() images: Express.Multer.File[]): Promise<DishDto> {
        const { image, ...input }: DishDto = { ...plainToInstance(DishDto, JSON.parse(inputInData.data)) };

        const isFileLoaded = images.length != 0;
        if (isFileLoaded) {
            var loadedImage = await this.fileService.createFile(images[0]);
        }

        try {
            if (isFileLoaded) {
                await this.dishService.update({ ...input, image: loadedImage });
            } else {
                await this.dishService.update(input as any);
            }
        } catch (error) {
            if (isFileLoaded) {
                this.fileService.removeFile(loadedImage.id);
            }
            return error;
        }

        return this.getOne(input.id);
    }

    @Roles(RolesEnum.Admin)
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteOne(@Param("id") id: number): Promise<number> {
        return this.dishService.deleteOne(id);
    }
}