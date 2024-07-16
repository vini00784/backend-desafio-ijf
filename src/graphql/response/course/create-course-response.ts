import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Course } from 'src/graphql/entities/course';

@ObjectType()
export class CreateCourseResponse {
  @Field(() => ID, { nullable: false })
  id: Course['id'];

  @Field(() => Date, { nullable: false })
  createdAt: Date;
}
