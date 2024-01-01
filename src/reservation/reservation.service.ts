import { Injectable } from "@nestjs/common";
import { ReservationEntity } from "./reservation.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientAuthService } from "src/auth/auth-client.service";
import { ReservationDto } from "./reservation.dto";

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(ReservationEntity) private readonly reservationRep: Repository<ReservationEntity>,
        private readonly clientService: ClientAuthService
    ) { }

    async getAll(): Promise<ReservationEntity[]> {
        return this.reservationRep.find();
    }

    async getAllOfUser(id: number): Promise<ReservationEntity[]> {
        return this.reservationRep.find({ where: { client: { id } } });
    }

    async getOne(id: number): Promise<ReservationEntity> {
        return this.reservationRep.findOne({ where: { id }, relations: { client: true } });
    }

    async create(input: ReservationDto): Promise<ReservationEntity> {
        delete input.id;
        console.log(input);
        if ("client" in input) {
            input.client = await this.clientService.getOne(input.client.id);
            console.log(input);
        }
        const saved = await this.reservationRep.save(input);
        return this.reservationRep.findOne({ where: { id: saved.id }, relations: { client: true } });
    }

    async update(input: ReservationDto): Promise<ReservationEntity> {
        if ("client" in input) {
            input.client = await this.clientService.getOne(input.client.id);
        }
        await this.reservationRep.update(input.id, input);
        return this.getOne(input.id);
    }
}