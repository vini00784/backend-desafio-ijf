import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LessonInput {
    @Field(() => String, { nullable: false })
    content: string;
}