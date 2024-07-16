import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCourseResponse } from '../response/course/create-course-response';
import { CreateCourseInput } from '../input/course/create-course.input';
import { UseAuthGuard } from 'src/guards/auth.guard';
import prisma from 'src/database/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AlreadyExistsError } from 'src/errors/already-exists.error';
import { GqlContext } from 'src/types/gql-context';
import { UpdateCourseInput } from '../input/course/edit-course.input';
import { UpdateCourseResponse } from '../response/course/update-course-response';
import { RequiredIdError } from 'src/errors/required-id.error';
import { DeleteCourseInput } from '../input/course/delete-course.input';
import { DeleteCourseResponse } from '../response/course/delete-course-response';
import { CannotDeleteError } from 'src/errors/cannot-delete.error';
import { AssignCourseToStudentInput } from '../input/course/assign-to-student.input';
import { AssignCourseToStudentResponse } from '../response/course/assign-to-student-response';
import { CannotCreateError } from 'src/errors/cannot-create.error';
import { RemoveStudentOfCourseResponse } from '../response/course/remove-student-response';
import { RemoveStudentOfCourseInput } from '../input/course/remove-student.input';
import { LoadCoursesResponse } from '../response/course/load-courses-response';

@Resolver()
export class CourseResolver {
  @UseAuthGuard(['teacher'])
  @Mutation(() => CreateCourseResponse, { nullable: false })
  async createCourse(
    @Context() context: GqlContext,
    @Args('input', { type: () => CreateCourseInput })
    input: CreateCourseInput,
  ): Promise<CreateCourseResponse> {
    try {
      const createdCourse = await prisma.course.create({
        data: {
          name: input.name,
          banner: input.banner,
          description: input.description,
          teacher: {
            connect: {
              id: context.user.id,
            },
          },
          lessons: {
            createMany: {
              data: input.lessons,
            },
          },
        },
      });

      return {
        id: createdCourse.id,
        createdAt: new Date(),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AlreadyExistsError();
        }
      }
      throw error;
    }
  }

  @UseAuthGuard(['teacher'])
  @Mutation(() => UpdateCourseResponse, { nullable: false })
  async updateCourse(
    @Args('input', { type: () => UpdateCourseInput })
    input: UpdateCourseInput,
  ): Promise<UpdateCourseResponse> {
    try {
      if (!input.id) throw new RequiredIdError();

      const updatedCourse = await prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          banner: input.banner,
        },
      });

      return {
        id: updatedCourse.id,
        updatedAt: new Date(),
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AlreadyExistsError();
        }
      }
      throw error;
    }
  }

  @UseAuthGuard(['teacher'])
  @Mutation(() => DeleteCourseResponse, { nullable: false })
  async deleteCourse(
    @Args('input', { type: () => DeleteCourseInput })
    input: DeleteCourseInput,
  ): Promise<DeleteCourseResponse> {
    try {
      if (!input.id) throw new RequiredIdError();

      const deletedCourse = await prisma.course.delete({
        where: {
          id: input.id,
        },
        include: {
          teacher: true,
          studentCourses: {
            include: {
              student: true,
            },
          },
        },
      });

      return {
        id: deletedCourse.id,
        deletedAt: new Date(),
      };
    } catch (error) {
      throw new CannotDeleteError();
    }
  }

  @UseAuthGuard(['teacher'])
  @Mutation(() => AssignCourseToStudentResponse, { nullable: true })
  async assignCourseToStudent(
    @Args('input', { type: () => AssignCourseToStudentInput })
    input: AssignCourseToStudentInput,
  ): Promise<AssignCourseToStudentResponse> {
    try {
      if (!input.courseId || !input.studentId) throw new RequiredIdError();

      await prisma.course.update({
        where: {
          id: input.courseId,
        },
        data: {
          studentCourses: {
            create: {
              student: {
                connect: {
                  id: input.studentId,
                },
              },
            },
          },
        },
      });

      const lessons = await prisma.lesson.findMany({
        where: {
          courseId: input.courseId,
        },
      });

      for (const lesson of lessons) {
        await prisma.studentLesson.create({
          data: {
            student: {
              connect: {
                id: input.studentId,
              },
            },
            lesson: {
              connect: {
                id: lesson.id,
              },
            },
          },
        });
      }

      return {
        message: 'Course assigned to student with success!',
      };
    } catch (error) {
      throw new CannotCreateError();
    }
  }

  @UseAuthGuard(['teacher'])
  @Mutation(() => RemoveStudentOfCourseResponse)
  async removeStudentOfCourse(
    @Args('input', { type: () => RemoveStudentOfCourseInput })
    input: RemoveStudentOfCourseInput,
  ): Promise<RemoveStudentOfCourseResponse> {
    try {
      if (!input.courseId || !input.studentId) throw new RequiredIdError();

      const courseStudents = await prisma.studentCourse.findMany({
        where: {
          courseId: input.courseId,
        },
      });

      const studentCourseToRemove = courseStudents.find(
        (studentCourse) => studentCourse.studentId === input.studentId,
      );

      await prisma.studentCourse.delete({
        where: {
          id: studentCourseToRemove.id,
        },
      });

      return {
        message: 'Student removed of course successfully!',
      };
    } catch (error) {
      throw new CannotDeleteError();
    }
  }

  @UseAuthGuard()
  @Query(() => [LoadCoursesResponse], { nullable: false })
  async loadCourses(
    @Context() context: GqlContext,
  ): Promise<LoadCoursesResponse[]> {
    try {
      const user = context.user;

      let courses: LoadCoursesResponse[];

      if (user.role === 'teacher') {
        courses = await prisma.course.findMany({
          where: {
            teacherId: user.id,
          },
          include: {
            studentCourses: {
              include: {
                student: {
                  include: {
                    studentLessons: {
                      select: {
                        id: true,
                        studentId: true,
                        lessonId: true,
                        isWatched: true,
                      },
                    },
                  },
                },
              },
            },
            lessons: true,
            teacher: true,
          },
        });
      } else if (user.role === 'student') {
        courses = await prisma.course.findMany({
          where: {
            studentCourses: {
              some: {
                studentId: user.id,
              },
            },
          },
          include: {
            studentCourses: {
              where: {
                studentId: user.id,
              },
              include: {
                student: {
                  include: {
                    studentLessons: {
                      where: {
                        studentId: user.id,
                      },
                    },
                  },
                },
              },
            },
            lessons: true,
            teacher: true,
          },
        });
      }

      return courses;
    } catch (error) {
      throw new Error(error);
    }
  }
}
