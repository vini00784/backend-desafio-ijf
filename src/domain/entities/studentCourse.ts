import { CourseStatusEnum } from 'src/types/course-status';
import { BaseEntity } from './base-entity';
import { Course } from './course';
import { Student } from './student';
import { randomUUID } from 'crypto';
import { CannotApproveStudentError } from 'src/errors/cannot-approve-student.error';

interface StudentCourseProps {
  course: Course;
  student: Student;
  status?: keyof typeof CourseStatusEnum;
}

export class StudentCourse extends BaseEntity<StudentCourseProps> {
  constructor(props: StudentCourseProps) {
    super(randomUUID(), {
      ...props,
      status: props.status || 'notStarted',
    });
  }

  approveStudent() {
    if (this.props.status === 'finished') this.props.status = 'approved';
    else
      throw new CannotApproveStudentError('student not finished this course.');
  }

  checkStatus() {
    const studentLessons = this.props.student.props.studentLessons;

    const watchedLessonsCount = studentLessons.filter(
      (studentLesson) => studentLesson.props.isWatched,
    ).length;
    let newCourseStatus: keyof typeof CourseStatusEnum = 'notStarted';

    if (watchedLessonsCount === studentLessons.length)
      newCourseStatus = 'finished';
    else if (
      watchedLessonsCount > 0 &&
      watchedLessonsCount < studentLessons.length
    )
      newCourseStatus = 'inProgress';

    this.props.status = newCourseStatus;
  }
}
