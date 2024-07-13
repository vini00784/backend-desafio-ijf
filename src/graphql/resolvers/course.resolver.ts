import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { CreateCourseResponse } from "../response/course/create-course-response";
import { CreateCourseInput } from "../input/course/create-course.input";
import { UseAuthGuard } from "src/guards/auth.guard";
import prisma from "src/database/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AlreadyExistsError } from "src/errors/already-exists.error";
import { GqlContext } from "src/types/gql-context";
import { UpdateCourseInput } from "../input/course/edit-course.input";
import { UpdateCourseResponse } from "../response/course/update-course-response";
import { RequiredIdError } from "src/errors/required-id.error";
import { DeleteCourseInput } from "../input/course/delete-course.input";
import { DeleteCourseResponse } from "../response/course/delete-course-response";
import { CannotDeleteError } from "src/errors/cannot-delete.error";

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

    @UseAuthGuard(["teacher"])
    @Mutation(() => UpdateCourseResponse, { nullable: false })
    async updateCourse(
        @Args("input", { type: () => UpdateCourseInput })
        input: UpdateCourseInput
    ): Promise<UpdateCourseResponse> {
        try {
            if(!input.id) throw new RequiredIdError();

            const updatedCourse = await prisma.course.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    description: input.description,
                    banner: input.banner
                }
            });

            return {
                id: updatedCourse.id,
                updatedAt: new Date()
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

    @UseAuthGuard(["teacher"])
    @Mutation(() => DeleteCourseResponse, { nullable: false })
    async deleteCourse(
        @Args("input", { type: () => DeleteCourseInput })
        input: DeleteCourseInput
    ): Promise<DeleteCourseResponse> {
        try {
            if(!input.id) throw new RequiredIdError();

            const deletedCourse = await prisma.course.delete({
                where: {
                    id: input.id
                },
                include: {
                    teacher: true,
                    studentCourses: {
                        include: {
                            student: true
                        }
                    }
                }
            });

            return {
                id: deletedCourse.id,
                deletedAt: new Date()
            }
        } catch (error) {
            throw new CannotDeleteError();
        }
    }
}