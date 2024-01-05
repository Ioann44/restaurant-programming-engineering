import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("kitchens")
export class KitchenEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;
}