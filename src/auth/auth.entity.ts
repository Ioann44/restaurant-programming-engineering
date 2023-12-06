import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 255, nullable: true })
    fullName: string;

    @Column("int")
    role: number;

    @Column({ length: 15, nullable: true })
    phone: string;

    @Column("text", { nullable: true })
    address: string;
}