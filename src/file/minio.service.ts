import { Injectable } from "@nestjs/common";
import * as Minio from "minio"
import { ConfigService } from "@nestjs/config";
import { FileService } from "src/file/file.service";

@Injectable()
export class MinioService {
	private minioClient: Minio.Client;
	private static readonly BUCKET_NAME = "images";

	constructor(
		private readonly configService: ConfigService
	) {
		this.minioClient = new Minio.Client({
			endPoint: this.configService.get("MINIO_ENDPOINT"),
			port: 9000,
			useSSL: this.configService.get("MINIO_USE_SSL") === "true",
			accessKey: this.configService.get("MINIO_USER"),
			secretKey: this.configService.get("MINIO_PASSWORD")
		});
	}

	async createBucketIfNotExists(): Promise<void> {
		const bucketExists = await this.minioClient.bucketExists(MinioService.BUCKET_NAME);
		if (!bucketExists) {
			await this.minioClient.makeBucket(MinioService.BUCKET_NAME, "us-east-1",);
			const policy = {
				Version: "2012-10-17",
				Statement: [
					{
						Effect: "Allow",
						Principal: "*",
						Action: ["s3:GetObject"],
						Resource: [`arn:aws:s3:::${MinioService.BUCKET_NAME}/*`],
					},
				],
			};
			await this.minioClient.setBucketPolicy(MinioService.BUCKET_NAME, JSON.stringify(policy));
		}
	}

	async uploadFile(file: Express.Multer.File, key: string): Promise<Minio.UploadedObjectInfo> {
		return this.minioClient.putObject(
			MinioService.BUCKET_NAME,
			key,
			file.buffer,
			file.size
		);
	}

	removeFile(key: string): Promise<void> {
		return this.minioClient.removeObject(MinioService.BUCKET_NAME, key);
	}
}
