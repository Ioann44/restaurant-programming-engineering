import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReservationEntity } from "./reservation.entity";
import { ReservationController } from "./reservation.controller";
import { ReservationService } from "./reservation.service";

@Module({
    controllers: [ReservationController],
    providers: [ReservationService],
    imports: [
        TypeOrmModule.forFeature([ReservationEntity]),
    ],
    exports: []
})
export class ReservationModule { }
