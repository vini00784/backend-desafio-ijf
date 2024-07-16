import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AssignCourseToStudentResponse {
  @Field(() => String, { nullable: false })
  message: string;
}
