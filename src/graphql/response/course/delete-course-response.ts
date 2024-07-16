import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Course } from '@prisma/client';

@ObjectType()
export class DeleteCourseResponse {
  @Field(() => ID, { nullable: false })
  id: Course['id'];

  @Field(() => Date, { nullable: false })
  deletedAt: Date;
}
