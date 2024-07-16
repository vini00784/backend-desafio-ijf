import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ApproveStudentResponse {
  @Field(() => String, { nullable: false })
  message: string;
}
