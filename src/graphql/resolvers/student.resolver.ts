import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseAuthGuard } from 'src/guards/auth.guard';
import { ApproveStudentResponse } from '../response/student/approve-student-response';
import { ApproveStudentInput } from '../input/student/approve-student.input';
import prisma from 'src/database/prisma';
import { CannotApproveStudentError } from 'src/errors/cannot-approve-student.error';

@Resolver()
export class StudentResolver {
  @UseAuthGuard(['teacher'])
  @Mutation(() => ApproveStudentResponse, { nullable: false })
  async approveStudent(
    @Args('input', { type: () => ApproveStudentInput })
    input: ApproveStudentInput,
  ): Promise<ApproveStudentResponse> {
    const course = await prisma.course.findUnique({
      where: {
        id: input.courseId,
      },
    });

    const [{ id: studentCourseId }] = await prisma.studentCourse.findMany({
      where: {
        courseId: course.id,
        studentId: input.studentId,
      },
    });

    const studentCourse = await prisma.studentCourse.findUnique({
      where: {
        id: studentCourseId,
      },
    });

    if (studentCourseId) {
      if (studentCourse.status === 'finished') {
        await prisma.studentCourse.update({
          where: {
            id: studentCourseId,
          },
          data: {
            status: 'approved',
          },
        });

        return {
          message: 'Student approved successfully!',
        };
      } else throw new CannotApproveStudentError('course is not finished.');
    } else
      throw new CannotApproveStudentError(
        'this student is not registered in this course.',
      );
  }
}
