import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveStudentOfCourseResponse {
  @Field(() => String, { nullable: false })
  message: string;
}
