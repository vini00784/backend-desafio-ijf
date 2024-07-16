import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentLesson } from '@prisma/client';
import { Course } from 'src/graphql/entities/course';
import { Lesson } from 'src/graphql/entities/lesson';
import { Student } from 'src/graphql/entities/student';
import { Teacher } from 'src/graphql/entities/teacher';

@ObjectType()
class LoadTeacherOfCourse {
  @Field(() => ID, { nullable: false })
  id?: Teacher['id'];

  @Field(() => String, { nullable: false })
  username?: string;

  @Field(() => String, { nullable: false })
  name?: string;
}

@ObjectType()
class LoadStudentLessonsByCourse {
  @Field(() => ID, { nullable: false })
  id?: StudentLesson['id'];

  @Field(() => ID, { nullable: false })
  lessonId?: Lesson['id'];

  @Field(() => ID, { nullable: false })
  studentId?: Student['id'];

  @Field(() => Boolean, { nullable: false })
  isWatched?: boolean;
}

@ObjectType()
class LoadStudentsOfCourse {
  @Field(() => ID, { nullable: false })
  id?: Student['id'];

  @Field(() => String, { nullable: false })
  username?: string;

  @Field(() => String, { nullable: false })
  name?: string;

  @Field(() => [LoadStudentLessonsByCourse])
  studentLessons?: LoadStudentLessonsByCourse[];
}

@ObjectType()
class LoadStudentCoursesByCourses {
  @Field(() => LoadStudentsOfCourse, { nullable: false })
  student?: LoadStudentsOfCourse;

  @Field(() => ID, { nullable: false })
  courseId?: Course['id'];

  @Field(() => String, { nullable: false })
  status?: string;
}

@ObjectType()
export class LoadCoursesResponse {
  @Field(() => ID, { nullable: false })
  id: Course['id'];

  @Field(() => String, { nullable: false })
  name?: string;

  @Field(() => String, { nullable: false })
  description?: string;

  @Field(() => String, { nullable: false })
  banner?: string;

  @Field(() => LoadTeacherOfCourse, { nullable: false })
  teacher?: LoadTeacherOfCourse;

  @Field(() => [Lesson])
  lessons?: Array<Partial<Lesson>>;

  @Field(() => [LoadStudentCoursesByCourses])
  studentCourses?: LoadStudentCoursesByCourses[];
}
