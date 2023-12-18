import { Body, Controller, Get, Param, Patch, Put, Delete, UseGuards, UseInterceptors, UploadedFiles } from "@nestjs/common";
import { DishAdminDto, DishAdminDtoOnLoad, DishPublicDto } from "./dish.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import DishService from "./dish.service";
import { Roles, RolesEnum } from "src/auth/auth.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { plainToInstance } from "class-transformer";
import { FileService } from "src/file/file.service";

@Controller("dish/")
export class DishController {
    constructor(
        private readonly dishService: DishService,
        private readonly fileService: FileService
    ) { }

    @Get("")
    async getAll(): Promise<DishPublicDto[]> {
        return (await this.dishService.getAll()).map(
            item => {
                return { ...item, image: item.image ? item.image.key : "" };
            });
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("image"))
    @Put("")
    async create(@Body() inputInData, @UploadedFiles() images: Express.Multer.File[]): Promise<DishAdminDto> {
        const input: DishAdminDto = plainToInstance(DishAdminDto, JSON.parse(inputInData.data));

        const isFileLoaded = images.length != 0;
        if (isFileLoaded) {
            var loadedImage = await this.fileService.createFile(images[0]);
        }
        var savedId = 0;

        try {
            if (isFileLoaded) {
                savedId = (await this.dishService.insertOne({ ...input, image: loadedImage })).id;
            } else {
                savedId = (await this.dishService.insertOne(input)).id;
            }
        } catch (error) {
            if (isFileLoaded) {
                this.fileService.removeFile(loadedImage.id);
            }
            return error;
        }

        return this.dishService.getOne(savedId);
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("image"))
    @Patch()
    async update(@Body() inputInData, @UploadedFiles() images: Express.Multer.File[]): Promise<DishAdminDto> {
        const input: DishAdminDto = plainToInstance(DishAdminDto, JSON.parse(inputInData.data));

        const isFileLoaded = images.length != 0;
        if (isFileLoaded) {
            var loadedImage = await this.fileService.createFile(images[0]);
        }

        try {
            if (isFileLoaded) {
                await this.dishService.update({ ...input, image: loadedImage });
            } else {
                await this.dishService.update(input);
            }
        } catch (error) {
            if (isFileLoaded) {
                this.fileService.removeFile(loadedImage.id);
            }
            return error;
        }

        return this.dishService.getOne(input.id);
    }

    @Roles(RolesEnum.admin)
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteOne(@Param("id") id: number): Promise<number> {
        return this.dishService.deleteOne(id);
    }
}