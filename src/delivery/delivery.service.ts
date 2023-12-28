import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryEntity } from "./delivery.entity";
import { DeliveryDto, DeliveryStatus } from "./delivery.dto";
import { DishService } from "src/dish/dish.service";
import { StaffAuthService } from "src/auth/auth-staff.service";
import { ClientAuthService } from "src/auth/auth-client.service";

@Injectable()
export class DeliveryService {
	constructor(
		@InjectRepository(DeliveryEntity) private readonly deliveryRep: Repository<DeliveryEntity>,
		private readonly dishService: DishService,
		private readonly staffService: StaffAuthService,
		private readonly clientService: ClientAuthService,
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
		const dishes = await Promise.all(
			input.dishes.map(
				async dish => {
					return this.dishService.getOne(dish.id);
				}
			)
		);
		const client = !input.client ? null : await this.clientService.getOne(input.client.id);
		const saved = await this.deliveryRep.save({
			...input,
			dishes: dishes,
			client: client,
			courier: null,
			status: DeliveryStatus.Accepted
		});
		return this.deliveryRep.findOne({ where: { id: saved.id }, relations: { dishes: true, client: true, courier: true } });
	}

	async update(input: DeliveryDto): Promise<DeliveryEntity> {
		let objToUpdate: any = { id: input.id };
		if (input.courier) {
			objToUpdate.courier = await this.staffService.getOne(input.courier.id);
		}
		if (input.status) {
			objToUpdate.status = input.status;
		}
		if (input.finishDate) {
			objToUpdate.finishDate = input.finishDate;
		}

		await this.deliveryRep.update(input.id, objToUpdate);
		return this.deliveryRep.findOne({ where: { id: input.id }, relations: { dishes: true, client: true, courier: true } });
	}
}
