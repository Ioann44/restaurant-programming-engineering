import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileEntity } from "./file.entity";
import { MinioService } from "./minio.service";
import { randomUUID } from "crypto";

@Injectable()
export class FileService {
	constructor(
		@InjectRepository(FileEntity) private readonly filesRep: Repository<FileEntity>,
		private minioService: MinioService
	) { }

	async createFile(file: Express.Multer.File): Promise<FileEntity> {
		const key = randomUUID() + "-" + file.originalname.replace(/ /g, "_");
		await this.minioService.uploadFile(file, key);
		return this.filesRep.save({
			originalName: file.originalname,
			type: file.mimetype,
			key: key
		});
	}

	async getOneFile(id: number): Promise<FileEntity> {
		return this.filesRep.findOne({ where: { id } });
	}

	async getAll(): Promise<FileEntity[]> {
		return this.filesRep.find();
	}

	async removeFile(id: number): Promise<number> {
		var fileEntity = await this.filesRep.findOne({ where: { id } })
		if (fileEntity) {
			await Promise.all([
				this.minioService.removeFile(fileEntity.key),
				this.filesRep.delete({ id })
			]);
		}
		return id;
	}

	async removeAll(): Promise<Number> {
		let deletionList = (await this.getAll()).map(async file => {
			try {
				await this.minioService.removeFile(file.key);
				await this.filesRep.delete(file.id);
				return true;
			} catch (error) {
				return false;
			}
		});
		let deletedCnt = (await Promise.all(deletionList)).filter(success => success).length;
		return deletedCnt;
	}
}
