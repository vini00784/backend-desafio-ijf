import { Field, ID, InputType } from "@nestjs/graphql";
import { Course } from "src/graphql/entities/course";
import { Student } from "src/graphql/entities/student";

@InputType()
export class RemoveStudentOfCourseInput {
    @Field(() => ID, { nullable: false })
    courseId: Course["id"];

    @Field(() => ID, { nullable: false })
    studentId: Student["id"];
}