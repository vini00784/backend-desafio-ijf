import { Request, Response } from 'express';
import { User } from 'src/graphql/entities/user';
import { UserRoleEnum } from './user-role';

export interface GqlContext {
  req: Request;
  res: Response;
  user?: Omit<User | null, 'password'> & { role: keyof typeof UserRoleEnum };
}
