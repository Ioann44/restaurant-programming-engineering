import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs"
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { StaffEntity } from "./auth.entity";
import { StaffDto, StaffSuppressedDto, UserReturnedDto } from "./auth.dto";

@Injectable()
export class StaffAuthService {
    constructor(
        @InjectRepository(StaffEntity) private readonly staffRep: Repository<StaffEntity>,
        private jwtService: JwtService
    ) { }

    async login(input: StaffDto): Promise<UserReturnedDto> {
        const user = await this.staffRep.findOne({ where: { email: input.email } });
        if (user && await bcrypt.compare(input.password, user.password)) {
            const { password, ...userShrinked } = { ...user };
            return { token: await this.generateToken(user), user: userShrinked as any };
        }
        throw new UnauthorizedException({ message: "Некорректный емайл или пароль" })
    }

    async register(input: StaffSuppressedDto): Promise<UserReturnedDto> {
        const { id, ...dtoNoId } = { ...input };
        const candidate = await this.staffRep.findOne({ where: { email: input.email } });
        if (candidate) {
            throw new ConflictException("Этот логин уже занят");
        }
        const hashPassword = await bcrypt.hash(input.password, 5);
        const user = await this.staffRep.save({ ...dtoNoId, password: hashPassword });
        const { password, ...userShrinked } = { ...user };
        return { token: await this.generateToken(user), user: userShrinked as any };
    }

    async getAll(): Promise<StaffEntity[]> {
        return this.staffRep.find();
    }

    async update(input: StaffDto): Promise<StaffEntity> {
        const { deliveries, ...inputShrinked } = { ...input };
        if (input.password) {
            inputShrinked.password = await bcrypt.hash(input.password, 5);
        }
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

    private async generateToken(user: StaffEntity): Promise<string> {
        const payload = { id: user.id, email: user.email, role: user.role };
        return this.jwtService.signAsync(payload);
    }
}