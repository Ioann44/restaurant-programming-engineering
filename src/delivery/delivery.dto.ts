import { ClientDto, StaffDto } from "src/auth/auth.dto";
import { DishDto } from "src/dish/dish.dto";

export enum DeliveryStatus {
	Accepted,
	Delivering,
	Done
}

export class DeliveryDto {
	id: number;
	dishes: DishDto[]
	dishesCount: number[]
	personsCount: number;
	status: DeliveryStatus;
	createDate: Date;
	finishDate: Date;
	address: string;
	client: ClientDto;
	courier: StaffDto;
}