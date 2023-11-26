import {Column, Entity, PrimaryColumn} from "typeorm";


@Entity('users')
export class UserEntity {
    @PrimaryColumn()
    id: number;

    @Column({ length: 255, nullable: true })
    email: string;

    @Column({ length: 255, nullable: true })
    password: string;
}