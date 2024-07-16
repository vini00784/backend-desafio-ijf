import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from './base-entity';
import { StudentLesson } from './student-lesson';
import { Course } from './course';

@ObjectType()
export class Lesson extends BaseEntity {
  @Field(() => ID, { nullable: false })
  courseId: Course['id'];

  @Field(() => String, { nullable: false })
  content: string;

  @Field(() => [StudentLesson])
  studentLessons: StudentLesson[];

  @Field(() => Course, { nullable: false })
  course: Course;
}
