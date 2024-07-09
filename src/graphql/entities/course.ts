import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "./base-entity";
import { Lesson } from "./lesson";
import { Teacher } from "./teacher";
import { StudentCourse } from "./student-course";

@ObjectType()
export class Course extends BaseEntity {
    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String, { nullable: false })
    description: string;

    @Field(() => String, { nullable: false })
    banner: string;

    @Field(() => ID, { nullable: false })
    teacherId: Teacher["id"];

    @Field(() => [Lesson])
    lessons: Lesson[];

    @Field(() => Teacher, { nullable: false })
    teacher: Teacher;

    @Field(() => [StudentCourse])
    studentCourses: StudentCourse[];
}