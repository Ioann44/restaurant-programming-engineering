import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
            }

            const user = this.jwtService.verify(token);
            req.user = user;
            console.log(user);

            const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
            if (!requiredRoles) {
                return true;
            }
            if (requiredRoles.some(role => user.role === role)) {
                return true;
            }

            throw new UnauthorizedException({ message: 'У вас нет необходимых прав для доступа' });
        } catch (e) {
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
        }
    }

}
