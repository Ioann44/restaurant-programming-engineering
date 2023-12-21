import { FileEntity } from "src/file/file.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity("dishes")
export class DishEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
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

	// @Column()
	@OneToOne(() => FileEntity, { nullable: true })
	@JoinColumn()
	image: FileEntity;
}