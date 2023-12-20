import { DishDto } from "src/dish/dish.dto";
import { DeliveryStatus } from "./delivery.service";

export class DeliveryDto {
	id: number;
	dishes: DishDto[]
	dishesCount: number[]
	personsCount: number;
	status: DeliveryStatus;
	createDate: Date;
	finishDate: Date;
	address: string;
}