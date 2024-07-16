import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtMiddleware } from 'src/middleware/jwt';
import { GqlContext } from 'src/types/gql-context';
import { UserRoleEnum } from 'src/types/user-role';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtMiddleware: JwtMiddleware,
    private allowedRoles?: Array<keyof typeof UserRoleEnum>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext<GqlContext>();
    const request = ctx.req;
    const token = this.#extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (this.allowedRoles && !this.allowedRoles.includes(payload.role))
        throw new ForbiddenException();

      ctx.user = await this.jwtMiddleware.extractUserFromHeaders(
        request.headers,
      );
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }

  #extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'bearer' ? token : undefined;
  }
}

export function UseAuthGuard(allowedRoles?: Array<keyof typeof UserRoleEnum>) {
  return UseGuards(
    new AuthGuard(
      new JwtService(),
      new ConfigService(),
      new JwtMiddleware(new JwtService(), new ConfigService()),
      allowedRoles,
    ),
  );
}
