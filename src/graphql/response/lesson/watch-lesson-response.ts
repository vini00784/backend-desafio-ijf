import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Lesson } from "src/graphql/entities/lesson";

@ObjectType()
export class WatchLessonResponse {
    @Field(() => ID, { nullable: false })
    id: Lesson["id"];

    @Field(() => Date, { nullable: false })
    watchedAt: Date;

    @Field(() => String, { nullable: false })
    message: string;
}