import { Injectable } from "@nestjs/common";
import { ReservationEntity } from "./reservation.entity";
import { Between, Repository } from "typeorm";
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
        return this.reservationRep.find({relations: { client: true }});
    }

    async getAllOfUser(id: number): Promise<ReservationEntity[]> {
        return this.reservationRep.find({ where: { client: { id } } });
    }

    async getOne(id: number): Promise<ReservationEntity> {
        return this.reservationRep.findOne({ where: { id }, relations: { client: true } });
    }

    async create(input: ReservationDto): Promise<ReservationEntity> {
        delete input.id;
        if ("client" in input) {
            input.client = await this.clientService.getOne(input.client.id);
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

    async getTablesOnDate(date: Date): Promise<Set<number>> {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const reservations = await this.reservationRep.find({ where: { reservationDate: Between(startDate, endDate) } });
        const usedTables = reservations.flatMap(item => item.tables);
        return new Set(usedTables);
    }
}