import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReservationEntity } from "./reservation.entity";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [ReservationController],
    providers: [ReservationService],
    imports: [
        TypeOrmModule.forFeature([ReservationEntity]),
        forwardRef(() => AuthModule)
    ],
    exports: [ReservationService]
})
export class ReservationModule { }
