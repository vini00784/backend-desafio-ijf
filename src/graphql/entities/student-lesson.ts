import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "./base-entity";
import { Student } from "./student";
import { Lesson } from "./lesson";

@ObjectType()
export class StudentLesson extends BaseEntity {
    @Field(() => ID, { nullable: false })
    studentId: Student["id"];

    @Field(() => ID, { nullable: false })
    lessonId: Lesson["id"];

    @Field(() => Boolean)
    isWatched: boolean;

    @Field(() => Student, { nullable: false })
    student: Student;

    @Field(() => Lesson, { nullable: false })
    lesson: Lesson;
}