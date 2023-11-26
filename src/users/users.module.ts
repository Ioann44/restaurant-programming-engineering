import {forwardRef, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./users.entity";


@Module({
    controllers: [],
    providers: [UsersService],
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => AuthModule),
    ],
    exports: [
        UsersService,
    ]
})
export class UsersModule {}
