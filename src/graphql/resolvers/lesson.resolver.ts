import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { UseAuthGuard } from "src/guards/auth.guard";
import { GqlContext } from "src/types/gql-context";
import { WatchLessonResponse } from "../response/lesson/watch-lesson-response";
import { WatchLessonInput } from "../input/lesson/watch-lesson.input";
import prisma from "src/database/prisma";
import { CannotWatchLessonError } from "src/errors/cannot-watch-lesson.error";
import { checkCourseStatus } from "src/utils/checkCourseStatus";

@Resolver()
export class LessonResolver {
    @UseAuthGuard(["student"])
    @Mutation(() => WatchLessonResponse, { nullable: false })
    async watchLesson(
        @Context() context: GqlContext,
        @Args("input", { type: () => WatchLessonInput })
        input: WatchLessonInput
    ): Promise<WatchLessonResponse> {
        const user = context.user;

        const lesson = await prisma.lesson.findUnique({
            where: {
                id: input.lessonId
            }
        });
        
        const [{ id: studentLessonId }] = await prisma.studentLesson.findMany({
            where: {
                lessonId: input.lessonId,
                studentId: user.id
            }
        });
        
        const studentLesson = await prisma.studentLesson.findUnique({
            where: {
                id: studentLessonId
            },
            include: {
                lesson: {
                    include: {
                        course: true
                    }
                }
            }
        });

        if(lesson) {
            if(studentLesson) {
                const updatedStudentLesson = await prisma.studentLesson.update({
                    where: {
                        id: studentLessonId
                    },
                    data: {
                        isWatched: true
                    }
                });

                const courseId = studentLesson.lesson.courseId;
                await checkCourseStatus(courseId, user.id);

                return {
                    id: updatedStudentLesson.id,
                    watchedAt: new Date(),
                    message: "Lesson watched successfully!"
                }
            } else throw new CannotWatchLessonError("you aren't registered in this lesson.");
        } else throw new CannotWatchLessonError("this lesson don't exists.");
    }
}