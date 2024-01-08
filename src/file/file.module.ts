import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileService } from "./file.service";
import { FileEntity } from "./file.entity";
import { FileController } from "./file.controller";
import { MinioService } from "src/file/minio.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    forwardRef(() => AuthModule)
  ],
  providers: [FileService, MinioService],
  exports: [FileService, MinioService],
  controllers: [FileController]
})
export class FileModule { }
