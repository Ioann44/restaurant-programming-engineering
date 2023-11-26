import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {UsersService} from "../users/users.service";
import {UserEntity} from "../users/users.entity";
import {UserFormat} from "../users/users.dto";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: UserFormat) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto: UserFormat) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            // console.log('Пользователь с таким email существует');
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword})
        return this.generateToken(user)
    }

    private async generateToken(user:UserEntity) {
        const payload = {email: user.email, id: user.id, password: user.password}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: UserFormat) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
}
