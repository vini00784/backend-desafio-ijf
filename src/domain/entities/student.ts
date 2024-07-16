import { randomUUID } from 'crypto';
import { BaseEntity } from './base-entity';
import { StudentCourse } from './studentCourse';
import { StudentLesson } from './studentLesson';
import { Course } from './course';
import { Lesson } from './lesson';

export interface StudentProps {
  name: string;
  username: string;
  password: string;
}

interface PropsToConstructor extends StudentProps {
  courses?: Course[];
}

interface PropsToEntity extends StudentProps {
  studentCourses: StudentCourse[];
  studentLessons: StudentLesson[];
}

export class Student extends BaseEntity<PropsToEntity> {
  constructor(props: PropsToConstructor) {
    super(randomUUID(), {
      ...props,
      studentCourses: [],
      studentLessons: [],
    });

    this.#fetchStudentCourseLessons(props.courses);
  }

  edit(props: Partial<Omit<StudentProps, 'lessons' | 'courses'>>) {
    this.props = { ...this.props, ...props };
  }

  addCourse(course: Course) {
    const studentCourse = new StudentCourse({
      course,
      student: this,
    });

    if (!this.props.studentCourses) this.props.studentCourses = [studentCourse];
    else this.props.studentCourses.push(studentCourse);
  }

  #fetchStudentCourseLessons(courses: PropsToConstructor['courses']) {
    this.#fetchStudentCourses(courses);
    this.#fetchStudentLessons(courses);
  }

  #fetchStudentCourses(courses: PropsToConstructor['courses']) {
    const studentCourses: StudentCourse[] = [];

    if (courses) {
      for (const course of courses) {
        const studentCourse = new StudentCourse({
          course,
          student: this,
        });

        if (!studentCourses.includes(studentCourse))
          studentCourses.push(studentCourse);
      }
    }

    this.props.studentCourses = studentCourses;
  }

  #fetchStudentLessons(courses: PropsToConstructor['courses']) {
    const studentLessons: StudentLesson[] = [];

    if (courses) {
      for (const course of courses) {
        for (const lesson of course.props.lessons) {
          const studentLesson = new StudentLesson({
            lesson,
            student: this,
          });

          if (!studentLessons.includes(studentLesson))
            studentLessons.push(studentLesson);
        }
      }
    }

    this.props.studentLessons = studentLessons;
  }

  changeWatchedLessonStatus(lessonId: Lesson['id']) {
    const foundedLesson = this.props.studentLessons.findIndex(
      (studentLesson) => studentLesson.props.lesson.id === lessonId,
    );

    const studentLesson = this.props.studentLessons[foundedLesson];

    if (studentLesson.props.isWatched) studentLesson.props.isWatched = false;
    else studentLesson.changeWatchStatus();

    this.#checkCourseStatus(lessonId);
  }

  #checkCourseStatus(studentLessonId: StudentLesson['id']) {
    const foundedCourse = this.props.studentCourses.findIndex(
      (course) =>
        !!course.props.course.props.lessons.find(
          (lesson) => lesson.id === studentLessonId,
        ),
    );

    this.props.studentCourses[foundedCourse].checkStatus();
  }
}
