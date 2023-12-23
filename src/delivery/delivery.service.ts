import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryEntity } from "./delivery.entity";
import { DeliveryDto, DeliveryStatus } from "./delivery.dto";

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
		return this.deliveryRep.findOne({ where: { id }, relations: { dishes: true } });
	}

	async create(input: DeliveryDto): Promise<DeliveryEntity> {
		const saved = await this.deliveryRep.save({
			...input,
			dishes: input.dishes.map(dish => { return { id: dish.id }; }),
			client: input.client && { id: input.client.id },
			courier: null,
			status: DeliveryStatus.Accepted
		});
		return this.deliveryRep.findOne({ where: { id: saved.id }, relations: { dishes: true, client: true, courier: true } });
	}
}
