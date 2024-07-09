import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./user";
import { StudentCourse } from "./student-course";
import { StudentLesson } from "./student-lesson";

@ObjectType()
export class Student extends User {
    @Field(() => [StudentCourse])
    studentCourses: StudentCourse[]

    @Field(() => [StudentLesson])
    studentLessons: StudentLesson[]
}