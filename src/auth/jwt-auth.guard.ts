import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { RolesEnum, JwtPayloadDto } from "./auth.dto";

export const Roles = (...roles: RolesEnum[]) => SetMetadata("roles", roles);

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader: string = req.headers.authorization;
            const [bearer, token] = authHeader.split(" ", 2);

            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException({ message: "Пользователь не авторизован" })
            }

            const user = this.jwtService.verify(token);
            req.user = user;

            const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());
            if (!requiredRoles) {
                return true;
            }
            if (requiredRoles.some(role => user.role === role)) {
                return true;
            }

            throw new UnauthorizedException({ message: "У вас нет необходимых прав для доступа" });
        } catch (e) {
            throw new UnauthorizedException({ message: "Пользователь не авторизован" })
        }
    }
}

@Injectable()
export class TokenParser {
    constructor(private readonly jwtService: JwtService) { }

    async parse(req: { headers: { authorization: string; }; }): Promise<JwtPayloadDto> {
        const authHeader: string = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        return this.jwtService.verify(token);
    }
}