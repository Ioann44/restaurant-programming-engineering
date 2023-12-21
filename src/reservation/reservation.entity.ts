import { ClientEntity } from "src/auth/auth.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("table-reservations")
export class ReservationEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("int2")
	personsCount: number;

	@Column("timestamptz")
	reservationDate: Date;

	@Column("int2", { array: true })
	tables: number[];

	// @Column()
	@ManyToOne(() => ClientEntity, { nullable: true })
	@JoinColumn()
	client: ClientEntity;
}