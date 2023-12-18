import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "./file.service";
import { MinioService } from "src/file/minio.service";
import { FileEntity } from "./file.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles, RolesEnum } from "src/auth/auth.service";

// using only for testing
@Controller("file/")
export class FileController {
    constructor(private readonly filesService: FileService, private readonly minioService: MinioService) { }

    @Get("one/:id")
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin)
    async getOne(@Param("id") id: number): Promise<FileEntity> {
        return this.filesService.getOneFile(id);
    }

    @Get("all")
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin)
    async getAll(): Promise<FileEntity[]> {
        return this.filesService.getAll();
    }

    @Post("")
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin)
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file): Promise<FileEntity> {
        return this.filesService.createFile(file);
    }

    @Delete("all")
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin)
    async removeAll(): Promise<Number> {
        // Deletes only unused files in mind, but somehow deletes them from index_page gallery too
        // Returns number of deleted files
        return await this.filesService.removeAll();
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @Roles(RolesEnum.admin)
    async removeOne(@Param("id") id: number): Promise<number> {
        this.filesService.removeFile(id);
        return id;
    }
}
