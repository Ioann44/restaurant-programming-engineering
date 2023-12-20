import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryEntity } from "./delivery.entity";

export enum DeliveryStatus {
	Accepted,
	Delivering,
	Done
}

@Injectable()
export class DeliveryService {
	constructor(
		@InjectRepository(DeliveryEntity) private readonly deliveryRep: Repository<DeliveryEntity>,
	) { }

	async getAll(): Promise<DeliveryEntity[]> {
		return this.deliveryRep.find({ relations: { client: true, courier: true } });
	}

	async getAllOfUser(id: number): Promise<DeliveryEntity[]> {
		return this.deliveryRep.find({ where: { client: { id } } });
	}

	async getOne(id: number): Promise<DeliveryEntity> {
		return this.deliveryRep.findOne({ where: { id } });
	}
}
