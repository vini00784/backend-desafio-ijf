import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { CreateCourseResponse } from "../response/course/create-course-response";
import { CreateCourseInput } from "../input/course/create-course.input";
import { UseAuthGuard } from "src/guards/auth.guard";
import prisma from "src/database/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AlreadyExistsError } from "src/errors/already-exists";
import { GqlContext } from "src/types/gql-context";

@Resolver()
export class CourseResolver {
    @UseAuthGuard(["teacher"])
    @Mutation(() => CreateCourseResponse, { nullable: false })
    async createCourse(
        @Context() context: GqlContext,
        @Args("input", { type: () => CreateCourseInput })
        input: CreateCourseInput
    ): Promise<CreateCourseResponse> {
        try {
            const createdCourse = await prisma.course.create({
                data: {
                    name: input.name,
                    banner: input.banner,
                    description: input.description,
                    teacher: {
                        connect: {
                            id: context.user.id
                        }
                    },
                    lessons: {
                        createMany: {
                            data: input.lessons
                        }
                    }
                }
            });

            return {
                id: createdCourse.id,
                createdAt: new Date()
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                  throw new AlreadyExistsError();
                }
              }
              throw error;
        }
    }
}