import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RestaurantEntity } from "./restaurant.entity";
import { Repository } from "typeorm";
import { DishService } from "src/dish/dish.service";

@Injectable()
export class RestaurantService {
	constructor(
		@InjectRepository(RestaurantEntity) private readonly restaurantRep: Repository<RestaurantEntity>,
		private readonly dishService: DishService
	) { }

	async getAll(): Promise<RestaurantEntity[]> {
		return this.restaurantRep.find({ relations: { menu: { image: true } } });
	}

	async getOne(id: number): Promise<RestaurantEntity> {
		return this.restaurantRep.findOne({ where: { id }, relations: { menu: { image: true } } });
	}

	async insert(input: RestaurantEntity): Promise<RestaurantEntity> {
		delete input.id;
		input.menu = await Promise.all(input.menu.map(dish => {
			return this.dishService.getOne(dish.id);
		}));
		const saved = await this.restaurantRep.save(input);
		return this.getOne(saved.id);
	}

	async update(input: RestaurantEntity): Promise<RestaurantEntity> {
		if (!await this.getOne(input.id)) {
			return null;
		}
		if ("menu" in input) {
			input.menu = await Promise.all(input.menu.map(dish => {
				return this.dishService.getOne(dish.id);
			}));
		}
		await this.restaurantRep.save(input);
		return this.getOne(input.id);
	}

	async delete(id: number): Promise<number> {
		await this.restaurantRep.delete(id);
		return id;
	}
}