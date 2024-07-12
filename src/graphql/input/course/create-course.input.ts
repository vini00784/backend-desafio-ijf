import { Field, ID, InputType } from "@nestjs/graphql";
import { Teacher } from "@prisma/client";
import { LessonInput } from "../lesson/create-lesson.input";

@InputType()
export class CreateCourseInput {
    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String, { nullable: false })
    description: string;

    @Field(() => String, { nullable: false })
    banner: string;

    @Field(() => ID, { nullable: false })
    teacherId: Teacher["id"];

    @Field(() => [LessonInput])
    lessons: LessonInput[];
}