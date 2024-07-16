import { Field, ID, InputType } from '@nestjs/graphql';
import { Lesson } from 'src/graphql/entities/lesson';

@InputType()
export class WatchLessonInput {
  @Field(() => ID, { nullable: false })
  lessonId: Lesson['id'];
}
