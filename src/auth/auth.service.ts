import { ConflictException, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { ClientEntity, StaffEntity } from "./auth.entity";
import { ClientDto, ClientSuppressedDto, StaffDto, StaffSuppressedDto } from "./auth.dto";

export const Roles = (...roles: RolesEnum[]) => SetMetadata("roles", roles);

export enum RolesEnum {
    Admin,
    Manager,
    Courier,
    Client
}

@Injectable()
export class StaffAuthService {
    constructor(
        @InjectRepository(StaffEntity) private readonly staffRep: Repository<StaffEntity>,
        private jwtService: JwtService
    ) { }

    async login(input: StaffDto): Promise<Object> {
        const user = await this.staffRep.findOne({ where: { email: input.email } });
        const passwordEquals = await bcrypt.compare(input.password, user.password);
        if (user && passwordEquals) {
            return this.generateToken(user);
        }
        throw new UnauthorizedException({ message: "Некорректный емайл или пароль" })
    }

    async register(input: StaffSuppressedDto): Promise<Object> {
        const { id, ...dtoNoId } = { ...input };
        const candidate = await this.staffRep.findOne({ where: { email: input.email } });
        if (candidate) {
            throw new ConflictException("Этот логин уже занят");
        }
        const hashPassword = await bcrypt.hash(input.password, 5);
        const user = await this.staffRep.save({ ...dtoNoId, password: hashPassword });
        return this.generateToken(user)
    }

    async getAll(): Promise<StaffEntity[]> {
        return this.staffRep.find();
    }

    async update(input: StaffDto): Promise<StaffEntity> {
        const { deliveries, password, ...inputShrinked } = { ...input };
        const saved = await this.staffRep.update(input.id, inputShrinked);
        return this.staffRep.findOne({ where: { id: input.id } });
    };

    async delete(id: number): Promise<number> {
        if (id == 1) {
            throw new ForbiddenException("Нельзя удалить администратора-основателя");
        }
        await this.staffRep.delete({ id });
        return id;
    }

    private async generateToken(user: StaffEntity): Promise<Object> {
        const payload = { id: user.id, email: user.email, role: user.role };
        return {
            token: await this.jwtService.signAsync(payload)
        };
    }
}

@Injectable()
export class ClientAuthService {
    constructor(
        @InjectRepository(ClientEntity) private readonly clientRep: Repository<ClientEntity>,
        private jwtService: JwtService
    ) { }

    async login(input: ClientDto): Promise<Object> {
        const user = await this.clientRep.findOne({ where: { email: input.email } });
        const passwordEquals = await bcrypt.compare(input.password, user.password);
        if (user && passwordEquals) {
            return this.generateToken(user);
        }
        throw new UnauthorizedException({ message: "Некорректный емайл или пароль" })
    }

    async register(input: ClientSuppressedDto): Promise<Object> {
        const { id, ...dtoNoId } = { ...input };
        const candidate = await this.clientRep.findOne({ where: { email: input.email } });
        if (candidate) {
            throw new ConflictException("Этот логин уже занят");
        }
        const hashPassword = await bcrypt.hash(input.password, 5);
        const user = await this.clientRep.save({ ...dtoNoId, password: hashPassword });
        return this.generateToken(user)
    }

    async getAll(): Promise<ClientEntity[]> {
        return this.clientRep.find();
    }

    async update(input: ClientDto): Promise<ClientEntity> {
        const { deliveries, reservations, password, ...inputShrinked } = { ...input };
        const saved = await this.clientRep.update(input.id, inputShrinked);
        return this.clientRep.findOne({ where: { id: input.id } });
    };

    async delete(id: number): Promise<number> {
        await this.clientRep.delete({ id });
        return id;
    }

    private async generateToken(user: ClientEntity): Promise<Object> {
        const payload = { id: user.id, email: user.email, role: RolesEnum.Client };
        return {
            token: await this.jwtService.signAsync(payload)
        };
    }
}