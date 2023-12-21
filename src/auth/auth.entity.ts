import { DeliveryEntity } from "src/delivery/delivery.entity";
import { ReservationEntity } from "src/reservation/reservation.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("staff")
export class StaffEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, nullable: true })
    fullName: string;

    @Column("int")
    role: number;

    @Column({ length: 15, nullable: true })
    phone: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    // @Column()
    @OneToMany(() => DeliveryEntity, (delivery) => delivery.courier, { nullable: true })
    deliveries: DeliveryEntity[];
}

@Entity("clients")
export class ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    fullName: string;

    @Column({ length: 15 })
    phone: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column("text", { nullable: true })
    address: string;

    @Column({ length: 255 })
    password: string;

    @OneToMany(() => DeliveryEntity, (delivery) => delivery.client)
    deliveries: DeliveryEntity[];

    @OneToMany(() => ReservationEntity, (reservation) => reservation.client)
    reservations: ReservationEntity[];
}