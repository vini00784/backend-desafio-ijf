import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginResponse } from '../response/auth/login-response';
import { LoginInput } from '../input/auth/login.input';
import { User } from '../entities/user';
import { UserRoleEnum } from 'src/types/user-role';
import prisma from 'src/database/prisma';
import { InvalidCredentialsError } from 'src/errors/invalid-credentials.error';
import { compareSync, hash } from 'bcrypt';
import { JwtMiddleware } from 'src/middleware/jwt';
import { CreateUserResponse } from '../response/auth/create-user-response';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from '../input/auth/create-user.input';
import { AlreadyExistsError } from 'src/errors/already-exists.error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly jwtMiddleware: JwtMiddleware,
    private readonly configService: ConfigService,
  ) {}

  @Mutation(() => LoginResponse, { nullable: false })
  async login(
    @Args('input', { type: () => LoginInput, nullable: false })
    input: LoginInput,
  ): Promise<LoginResponse> {
    try {
      let user: User;

      if (input.userRole === UserRoleEnum.student) {
        user = await prisma.student.findUnique({
          where: {
            username: input.username,
          },
        });
      } else if (input.userRole === UserRoleEnum.teacher) {
        user = await prisma.teacher.findUnique({
          where: {
            username: input.username,
          },
        });
      }

      if (!user) throw new InvalidCredentialsError();

      const verify = compareSync(input.password, user.password);

      if (verify) {
        return {
          token: this.jwtMiddleware.signIn(user.id, input.userRole).token,
        };
      } else throw new InvalidCredentialsError();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => CreateUserResponse, { nullable: false })
  async createUser(
    @Args('input', { type: () => CreateUserInput, nullable: false })
    input: CreateUserInput,
  ): Promise<CreateUserResponse> {
    try {
      if (input.userRole === 'teacher') return await this.#createTeacher(input);
      else if (input.userRole === 'student')
        return await this.#createStudent(input);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AlreadyExistsError();
        }
      }
      throw error;
    }
  }

  async #createTeacher(
    teacherData: CreateUserInput,
  ): Promise<CreateUserResponse> {
    const { id, username, createdAt } = await prisma.teacher.create({
      data: {
        name: teacherData.name,
        username: teacherData.username,
        password: await hash(
          teacherData.password,
          +this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
        ),
      },
    });

    return {
      id,
      username,
      createdAt,
    };
  }

  async #createStudent(
    studentData: CreateUserInput,
  ): Promise<CreateUserResponse> {
    const { id, username, createdAt } = await prisma.student.create({
      data: {
        name: studentData.name,
        username: studentData.username,
        password: await hash(
          studentData.password,
          +this.configService.get<number>('BCRYPT_SALT_ROUNDS'),
        ),
      },
    });

    return {
      id,
      username,
      createdAt,
    };
  }
}
