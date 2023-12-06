import { RolesEnum } from "./auth.service";

export class AuthDto {
    email: string;
    password: string;
    role: RolesEnum;
}