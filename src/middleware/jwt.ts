import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRoleEnum } from "src/types/user-role";

@Injectable()
export class JwtMiddleware {
    constructor(
        private readonly jwtService: JwtService
    ) {}

    signIn(userId: string, userRole: keyof typeof UserRoleEnum) {
        const payload = {
            sub: userId,
            userRole: userRole
        };

        const token = this.jwtService.sign(payload);

        return {
            token
        }
    }
}