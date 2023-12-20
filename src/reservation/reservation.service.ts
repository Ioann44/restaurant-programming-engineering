import { Injectable } from "@nestjs/common";
import { ReservationEntity } from "./reservation.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(ReservationEntity) private readonly reservationRep: Repository<ReservationEntity>,
    ) { }

    async getAll(): Promise<ReservationEntity[]> {
        return this.reservationRep.find();
    }

    async getAllOfUser(id: number): Promise<ReservationEntity[]> {
        return this.reservationRep.find({ where: { client: { id } } });
    }

    async getOne(id: number): Promise<ReservationEntity> {
        return this.reservationRep.findOne({ where: { id } });
    }
}