import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import prisma from 'src/database/prisma';
import { User } from 'src/graphql/entities/user';
import { GqlContext } from 'src/types/gql-context';
import { UserRoleEnum } from 'src/types/user-role';

@Injectable()
export class JwtMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  signIn(userId: string, userRole: keyof typeof UserRoleEnum) {
    const payload = {
      sub: userId,
      role: userRole,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  extractUserFromHeaders = async (
    headers: GqlContext['req']['headers'],
  ): Promise<Omit<User, 'password'> & { role: keyof typeof UserRoleEnum }> => {
    const { authorization } = headers;

    if (!authorization) return undefined;

    const token = authorization.split(' ')[1];
    const { sub, role } = this.#getPayloadByToken(token);

    if (role === 'teacher') {
      const foundedTeacher = await prisma.teacher.findUnique({
        where: {
          id: sub,
        },
      });

      return {
        id: foundedTeacher.id,
        name: foundedTeacher.name,
        createdAt: foundedTeacher.createdAt,
        username: foundedTeacher.username,
        role: 'teacher',
      };
    } else if (role === 'student') {
      const foundedStudent = await prisma.student.findUnique({
        where: {
          id: sub,
        },
      });

      return {
        id: foundedStudent.id,
        name: foundedStudent.name,
        createdAt: foundedStudent.createdAt,
        username: foundedStudent.username,
        role: 'student',
      };
    }
  };

  #getPayloadByToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      sub: payload.sub,
      role: payload.role,
    };
  }
}
