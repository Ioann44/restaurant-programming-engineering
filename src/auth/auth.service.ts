import { ConflictException, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserEntity } from "./auth.entity";
import { AuthDto } from "./auth.dto";

export const Roles = (...roles: RolesEnum[]) => SetMetadata("roles", roles);

export enum RolesEnum {
    admin,
    manager,
    courier,
    client
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRep: Repository<UserEntity>,
        private jwtService: JwtService) { }

    async login(authDto: AuthDto): Promise<Object> {
        const user = await this.userRep.findOne({ where: { email: authDto.email } });
        const passwordEquals = await bcrypt.compare(authDto.password, user.password);
        if (user && passwordEquals) {
            return this.generateToken(user);
        }
        throw new UnauthorizedException({ message: "Некорректный емайл или пароль" })
    }

    async register(authDto: AuthDto): Promise<Object> {
        const { id, ...dtoNoId } = { ...authDto };
        const candidate = await this.userRep.findOne({ where: { email: authDto.email } });
        if (candidate) {
            throw new ConflictException("Этот логин уже занят");
        }
        const hashPassword = await bcrypt.hash(authDto.password, 5);
        const user = await this.userRep.save({ ...dtoNoId, password: hashPassword });
        return this.generateToken(user)
    }

    async getAll(): Promise<UserEntity[]> {
        return this.userRep.find();
    }

    async update(input: AuthDto): Promise<AuthDto> {
        const saved = await this.userRep.update(input.id, input);
        return this.userRep.findOne({ where: { id: input.id } });
    };

    async delete(id: number): Promise<number> {
        // const user = await this.userRep.findOne({ where: { id } });
        if (id == 1) {
            throw new ForbiddenException("Нельзя удалить администратора-основателя");
        }
        await this.userRep.delete({ id });
        return id;
    }


    private async generateToken(user: UserEntity): Promise<Object> {
        const payload = { id: user.id, email: user.email, role: user.role };
        return {
            token: await this.jwtService.signAsync(payload)
        }
    }
}
