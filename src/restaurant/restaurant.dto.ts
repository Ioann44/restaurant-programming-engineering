import { DishDto } from "src/dish/dish.dto";

export class RestaurantDto {
	name: string;
	address: string;
	menu: DishDto[];
	tables: TableDto[];
	freePlaces: number;
}

export class TableDto {
	id: number;
	capacity: number;
	used: boolean
}

export class DateDto {
	date: Date;
}