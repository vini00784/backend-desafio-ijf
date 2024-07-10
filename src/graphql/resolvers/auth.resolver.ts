import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoginResponse } from "../response/auth/login-response";
import { LoginInput } from "../input/auth/login.input";
import { User } from "../entities/user";
import { UserRoleEnum } from "src/types/user-role";
import prisma from "src/database/prisma";
import { InvalidCredentialsError } from "src/errors/invalid-credentials.error";
import { compareSync } from "bcrypt";
import { JwtMiddleware } from "src/middleware/jwt";

@Resolver()
export class AuthResolver {
    constructor(
        private readonly jwtMiddleware: JwtMiddleware
    ) {}

    @Mutation(() => LoginResponse, { nullable: false })
    async login(
        @Args("input", { type: () => LoginInput, nullable: false })
        input: LoginInput
    ): Promise<LoginResponse> {
        try {
            let user: User;

            if(input.userRole === UserRoleEnum.student) {
                user = await prisma.student.findUnique({
                    where: {
                        username: input.username
                    }
                });
            } else if(input.userRole === UserRoleEnum.teacher) {
                user = await prisma.teacher.findUnique({
                    where: {
                        username: input.username
                    }
                });
            }

            if(!user) throw new InvalidCredentialsError();

            const verify = compareSync(input.password, user.password);

            if(verify) {
                return {
                    token: this.jwtMiddleware.signIn(user.id, input.userRole).token
                }
            } else throw new InvalidCredentialsError();
        } catch (error) {
            throw new Error(error)
        }
    }

    @Query(() => String)
    test() {
        return "Hello World!"
    }
}