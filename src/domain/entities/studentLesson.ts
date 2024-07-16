import { randomUUID } from 'crypto';
import { BaseEntity } from './base-entity';
import { Lesson } from './lesson';
import { Student } from './student';

interface StudentLessonProps {
  lesson: Lesson;
  student: Student;
  isWatched?: boolean;
}

export class StudentLesson extends BaseEntity<StudentLessonProps> {
  constructor(props: StudentLessonProps) {
    super(randomUUID(), {
      ...props,
      isWatched: props.isWatched || false,
    });
  }

  changeWatchStatus() {
    this.props.isWatched = !this.props.isWatched;
  }
}
