import {HttpException, HttpStatus, Injectable} from '@nestjs/common';

import {UserEntity} from "./users.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserFormat} from "./users.dto";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRep: Repository<UserEntity>
    ) {}

    async createUser(dto: UserFormat) {

        const user = await this.userRep.save({email: dto.email, password: dto.password, id: 1});
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRep.findOne({where: {email}});
        return user;
    }

}
