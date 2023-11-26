import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: "database",
        port: 5432,
        username: "user",
        password: config.get<string>("DATABASE_PASSWORD"),
        database: "database",
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: true, // don"t use on production
        // logging: true
      })
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
