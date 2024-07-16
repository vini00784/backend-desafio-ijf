import { randomUUID } from 'crypto';
import { BaseEntity } from './base-entity';
import { Course } from './course';

interface TeacherProps {
  name: string;
  username: string;
  password: string;
  courses?: Course[];
}

export class Teacher extends BaseEntity<TeacherProps> {
  constructor(props: TeacherProps) {
    super(randomUUID(), {
      ...props,
      courses: props.courses || [],
    });
  }
}
