import { Field, ID, InputType } from "@nestjs/graphql";
import { Course } from "src/graphql/entities/course";

@InputType()
export class UpdateCourseInput {
    @Field(() => ID, { nullable: false })
    id: Course["id"];

    @Field(() => String, { nullable: true})
    name: string;

    @Field(() => String, { nullable: true})
    description: string;

    @Field(() => String, { nullable: true})
    banner: string;
}