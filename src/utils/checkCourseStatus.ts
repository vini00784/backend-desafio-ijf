import prisma from 'src/database/prisma';
import { CourseStatusEnum } from 'src/types/course-status';

export async function checkCourseStatus(courseId: string, studentId: string) {
  const [{ id: studentCourseId }] = await prisma.studentCourse.findMany({
    where: {
      courseId,
      studentId,
    },
  }); // Usar esse tipo de estrutura ' [{ attribute }] ' quando se pode vir mais de um elemento é um equívoco, porque mesmo vindo mais de um, ele retorna apenas o primeiro que é encontrado, por isso usei o flatMap na lógica que está mais abaixo.

  const studentCourse = await prisma.studentCourse.findUnique({
    where: {
      id: studentCourseId,
    },
    include: {
      course: {
        include: {
          lessons: {
            include: {
              studentLessons: true,
            },
          },
        },
      },
    },
  });

  const studentLessons = studentCourse.course.lessons.flatMap(
    (item) => item.studentLessons,
  ); // O "flatMap" resolve o problema de retornar um "array de arrays", que estava ocorrendo com a utilização do map convencional. O flatMap mapeia um a um e achata tudo em um só array, enquanto o map cria um novo array a partir do resultado mas sem alterar a estrutura do array resultante.

  const watchedLessonsCount = studentLessons.filter(
    (studentLesson) => studentLesson.isWatched,
  ).length;
  let newCourseStatus: keyof typeof CourseStatusEnum = 'notStarted';

  if (watchedLessonsCount === studentLessons.length)
    newCourseStatus = 'finished';
  else if (
    watchedLessonsCount > 0 &&
    watchedLessonsCount < studentLessons.length
  )
    newCourseStatus = 'inProgress';

  if (studentCourse.status !== newCourseStatus) {
    await prisma.studentCourse.update({
      where: {
        id: studentCourseId,
      },
      data: {
        status: newCourseStatus,
      },
    });
  }
}
