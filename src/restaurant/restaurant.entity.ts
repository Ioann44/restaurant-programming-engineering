import { DishEntity } from "src/dish/dish.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity("restaurants")
export class RestaurantEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	address: string;

	@ManyToMany(() => DishEntity)
	@JoinTable()
	menu: DishEntity[];

	@Column("int", {array: true})
	tables: number[];
}