import { StaffDto } from "src/auth/auth.dto";
import { ClientEntity, StaffEntity } from "src/auth/auth.entity";
import { DishEntity } from "src/dish/dish.entity";
import { Entity, PrimaryGeneratedColumn, ManyToMany, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { DeliveryStatus } from "./delivery.service";

@Entity("delivery-orders")
export class DeliveryEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => DishEntity)
	dishes: DishEntity[]

	@Column("int2", { array: true })
	dishesCount: number[]

	@Column("int2")
	personsCount: number;

	@Column("int")
	status: DeliveryStatus;

	@CreateDateColumn()
	createDate: Date;

	@Column("datetime", { nullable: true })
	finishDate: Date;

	@Column("text")
	address: string;

	@ManyToOne(() => ClientEntity, { nullable: true })
	@JoinColumn()
	client: ClientEntity;

	@ManyToOne(() => StaffDto, { nullable: true })
	@JoinColumn()
	courier: StaffEntity
}