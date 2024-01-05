import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { MinioService } from "./file/minio.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const minioService = app.get<MinioService>(MinioService);
  await minioService.createBucketIfNotExists();

  app.enableCors({
    origin: (origin, callback) => {
      if (true) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });

  const port = 3000;
  await app.listen(port, () => { console.log(`App started on port: ${port}`); });
}
bootstrap();
