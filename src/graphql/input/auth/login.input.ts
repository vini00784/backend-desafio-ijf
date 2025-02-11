import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { UserRoleEnum } from 'src/types/user-role';

@InputType()
export class LoginInput {
  @Field(() => UserRoleEnum, { nullable: false })
  userRole: keyof typeof UserRoleEnum;

  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: false })
  password: string;
}

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
});
