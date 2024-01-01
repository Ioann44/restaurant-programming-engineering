import { ClientEntity } from "src/auth/auth.entity";

export class ReservationDto {
	id: number;
	personsCount: number;
	reservationDate: Date;
	tables: number[];
	client: ClientEntity;
}