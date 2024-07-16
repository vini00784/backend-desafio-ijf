import { Field, ID, InputType } from '@nestjs/graphql';
import { Course } from '@prisma/client';

@InputType()
export class DeleteCourseInput {
  @Field(() => ID, { nullable: false })
  id: Course['id'];
}
