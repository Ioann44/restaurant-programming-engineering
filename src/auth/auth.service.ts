import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from "./auth.entity";
import { AuthDto } from "./auth.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRep: Repository<UserEntity>,
        private jwtService: JwtService) { }

    async login(authDto: AuthDto) {
        const user = await this.validateUser(authDto)
        return this.generateToken(user)
    }

    async registration(authDto: AuthDto) {
        const candidate = await this.userRep.findOne({ where: { email: authDto.email } });
        if (candidate) {
            // console.log('Пользователь с таким email существует');
        }
        const hashPassword = await bcrypt.hash(authDto.password, 5);
        const user = await this.userRep.save({ ...authDto, password: hashPassword });
        return this.generateToken(user)
    }

    private async generateToken(user: UserEntity) {
        const payload = { email: user.email, id: user.id, password: user.password }
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(authDto: AuthDto) {
        const user = await this.userRep.findOne({ where: { email: authDto.email } });
        const passwordEquals = await bcrypt.compare(authDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
    }
}
