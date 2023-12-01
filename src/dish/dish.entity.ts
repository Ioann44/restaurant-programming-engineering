import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('dishes')
export class DishEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column("int2")
	weight: number;

	@Column("text")
	desc: string;

	@Column("int2")
	calories: number;

	@Column("int2")
	price: number;

	// @ManyToOne
	// kitchen: number;
}