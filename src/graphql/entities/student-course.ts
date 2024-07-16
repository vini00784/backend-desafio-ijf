import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from './base-entity';
import { Student } from './student';
import { Course } from './course';
import { CourseStatusEnum } from 'src/types/course-status';

@ObjectType()
export class StudentCourse extends BaseEntity {
  @Field(() => ID, { nullable: false })
  studentId: Student['id'];

  @Field(() => ID, { nullable: false })
  courseId: Course['id'];

  @Field(() => CourseStatusEnum, { nullable: false })
  status: keyof typeof CourseStatusEnum;

  @Field(() => Student, { nullable: false })
  student: Student;

  @Field(() => Course, { nullable: false })
  course: Course;
}

registerEnumType(CourseStatusEnum, {
  name: 'CourseStatus',
});
