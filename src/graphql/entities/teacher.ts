import { Course } from './course';
import { User } from './user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Teacher extends User {
  @Field(() => [Course])
  courses: Course[];
}
