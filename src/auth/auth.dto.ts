import { DeliveryDto } from "src/delivery/delivery.dto";
import { ReservationDto } from "src/reservation/reservation.dto";
import { RolesEnum } from "./auth.service";

export class StaffSuppressedDto {
    id: number;
    role: RolesEnum;
    email: string;
    password: string;
}

export class StaffDto {
    id: number;
    fullName: string;
    role: RolesEnum;
    phone: string;
    email: string;
    password: string;
    deliveries: DeliveryDto;
}

export class ClientSuppressedDto {
    id: number;
    email: string;
    password: string;
}

export class ClientDto {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    address: string;
    password: string;
    deliveries: DeliveryDto;
    reservations: ReservationDto;
}

export class jwtPayloadDto {
    id: number;
    role: RolesEnum;
    email: string;
}