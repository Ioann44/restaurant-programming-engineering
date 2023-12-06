import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: true })
    email: string;

    @Column({ length: 255, nullable: true })
    password: string;

    @Column("int")
    role: number;
}