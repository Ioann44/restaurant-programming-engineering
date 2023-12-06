import { RolesEnum } from "./auth.service";

export class AuthDto {
    id: number; // used admin on update
    email: string;
    password: string;
    fullName: string;
    role: RolesEnum; // not needed for client
    phone: string;
    address: string;
}