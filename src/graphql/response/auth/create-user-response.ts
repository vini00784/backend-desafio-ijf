import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/graphql/entities/user';

@ObjectType()
export class CreateUserResponse {
  @Field(() => ID, { nullable: false })
  id: User['id'];

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;
}
